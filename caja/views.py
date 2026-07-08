import json
from django.shortcuts import render
from django.http import JsonResponse, HttpResponse
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.views.decorators.csrf import csrf_exempt
from django.utils.dateparse import parse_date
from decimal import Decimal
from .models import PerfilUsuario, Colaborador, RegistroCaja, PagoPendiente, EfectivoVentas

# Seeding function to create users on first request if they don't exist
def seed_users_if_empty():
    if not User.objects.filter(username='Falcon').exists() or not User.objects.filter(username='admin').exists():
        # Clear all users (cascade deletes PerfilUsuario)
        User.objects.all().delete()
        
        # Create Andres Correa (Falcon)
        u1 = User.objects.create_user(username='Falcon', password='900928Aa!', first_name='Andres Correa')
        PerfilUsuario.objects.get_or_create(user=u1, rol='Administrador')
        
        # Create admin (admin)
        u2 = User.objects.create_user(username='admin', password='123456', first_name='admin')
        PerfilUsuario.objects.get_or_create(user=u2, rol='Administrador')

# Main Template Render View
def index_view(request):
    seed_users_if_empty()
    return render(request, 'index.html')

# Session API Views
@csrf_exempt
def api_login(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'Method not allowed'}, status=405)
    try:
        data = json.loads(request.body)
        username = data.get('username')
        password = data.get('password')
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            perfil = user.perfil
            return JsonResponse({
                'success': True,
                'user': {
                    'id': f"u_{user.id}",
                    'nombre': user.first_name or user.username,
                    'usuario': user.username,
                    'rol': perfil.rol,
                    'modulo': perfil.modulo
                }
            })
        return JsonResponse({'error': 'Usuario o contraseña incorrectos.'}, status=401)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)

@csrf_exempt
def api_logout(request):
    logout(request)
    return JsonResponse({'success': True})

def api_session(request):
    seed_users_if_empty()
    if request.user.is_authenticated:
        try:
            perfil = request.user.perfil
        except PerfilUsuario.DoesNotExist:
            perfil = PerfilUsuario.objects.create(user=request.user)
        return JsonResponse({
            'user': {
                'id': f"u_{request.user.id}",
                'nombre': request.user.first_name or request.user.username,
                'usuario': request.user.username,
                'rol': perfil.rol,
                'modulo': perfil.modulo
            }
        })
    return JsonResponse({'user': None})

# Helper decorator/checker for API roles
def check_permission(user, action, modulo=None):
    if not user.is_authenticated:
        return False
    try:
        perfil = user.perfil
    except PerfilUsuario.DoesNotExist:
        return False
    if perfil.rol == 'Administrador':
        return True
    if perfil.rol == 'Visualización':
        return action == 'read'
    if perfil.rol == 'Operador de Módulo':
        if action == 'read':
            return True
        if action == 'write' and perfil.modulo == modulo:
            return True
    return False

# Modulo 0: Colaboradores REST API
@csrf_exempt
def api_colaboradores(request):
    if not request.user.is_authenticated:
        return JsonResponse({'error': 'Unauthorized'}, status=401)

    if request.method == 'GET':
        colaboradores = Colaborador.objects.all().order_by('nombre')
        data = [{'id': f"t_{c.id}", 'nombre': c.nombre, 'tipo': c.tipo, 'documento': c.documento, 'telefono': c.telefono} for c in colaboradores]
        return JsonResponse(data, safe=False)

    elif request.method == 'POST':
        if not check_permission(request.user, 'write', 'modulo0'):
            # Modulo0 allows write only to Admin
            if request.user.perfil.rol != 'Administrador':
                return JsonResponse({'error': 'Forbidden'}, status=403)
        try:
            body = json.loads(request.body)
            colab = Colaborador.objects.create(
                nombre=body.get('nombre'),
                tipo=body.get('tipo'),
                documento=body.get('documento'),
                telefono=body.get('telefono', '')
            )
            return JsonResponse({'success': True, 'id': f"t_{colab.id}"})
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)

@csrf_exempt
def api_colaborador_detail(request, pk):
    if not request.user.is_authenticated:
        return JsonResponse({'error': 'Unauthorized'}, status=401)
    
    try:
        colab = Colaborador.objects.get(pk=pk)
    except Colaborador.DoesNotExist:
        return JsonResponse({'error': 'Not found'}, status=404)

    if request.method == 'PUT':
        if request.user.perfil.rol != 'Administrador':
            return JsonResponse({'error': 'Forbidden'}, status=403)
        try:
            body = json.loads(request.body)
            colab.nombre = body.get('nombre', colab.nombre)
            colab.tipo = body.get('tipo', colab.tipo)
            colab.documento = body.get('documento', colab.documento)
            colab.telefono = body.get('telefono', colab.telefono)
            colab.save()
            return JsonResponse({'success': True})
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)

    elif request.method == 'DELETE':
        if request.user.perfil.rol != 'Administrador':
            return JsonResponse({'error': 'Forbidden'}, status=403)
        # Check referential integrity (cannot delete if used in any transactional modulo)
        if colab.registros_caja.exists() or colab.pagos_pendientes.exists() or colab.ventas_entregadas.exists() or colab.ventas_recibidas.exists():
            return JsonResponse({'error': 'No se puede eliminar el colaborador porque tiene transacciones asociadas.'}, status=400)
        colab.delete()
        return JsonResponse({'success': True})

# Helper function to strip "t_" prefix from IDs
def clean_id(val):
    if isinstance(val, str) and val.startswith("t_"):
        return int(val[2:])
    return val

# Modulo 1: Registro Caja REST API
@csrf_exempt
def api_caja(request):
    if not request.user.is_authenticated:
        return JsonResponse({'error': 'Unauthorized'}, status=401)

    if request.method == 'GET':
        registros = RegistroCaja.objects.all().order_by('-fecha')
        data = [{
            'id': f"m1_{r.id}",
            'fecha': r.fecha.isoformat(),
            'tipo_movimiento': r.tipo_movimiento,
            'entregado_a': f"t_{r.entregado_a_id}",
            'concepto': r.concepto,
            'valor': float(r.valor),
            'comercio': r.comercio or '',
            'factura': r.factura or '',
            'numero_recibo': r.numero_recibo or '',
            'soporte': r.soporte or ''
        } for r in registros]
        return JsonResponse(data, safe=False)

    elif request.method == 'POST':
        if not check_permission(request.user, 'write', 'modulo1'):
            return JsonResponse({'error': 'Forbidden'}, status=403)
        try:
            body = json.loads(request.body)
            colab_id = clean_id(body.get('entregado_a'))
            reg = RegistroCaja.objects.create(
                fecha=parse_date(body.get('fecha')),
                tipo_movimiento=body.get('tipo_movimiento'),
                entregado_a_id=colab_id,
                concepto=body.get('concepto'),
                valor=Decimal(str(body.get('valor'))),
                comercio=body.get('comercio', ''),
                factura=body.get('factura', ''),
                numero_recibo=body.get('numero_recibo', ''),
                soporte=body.get('soporte', '')
            )
            return JsonResponse({'success': True, 'id': f"m1_{reg.id}"})
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)

@csrf_exempt
def api_caja_detail(request, pk):
    if not request.user.is_authenticated:
        return JsonResponse({'error': 'Unauthorized'}, status=401)
    try:
        reg = RegistroCaja.objects.get(pk=pk)
    except RegistroCaja.DoesNotExist:
        return JsonResponse({'error': 'Not found'}, status=404)

    if request.method == 'PUT':
        if not check_permission(request.user, 'write', 'modulo1'):
            return JsonResponse({'error': 'Forbidden'}, status=403)
        try:
            body = json.loads(request.body)
            reg.fecha = parse_date(body.get('fecha', reg.fecha.isoformat()))
            reg.tipo_movimiento = body.get('tipo_movimiento', reg.tipo_movimiento)
            reg.entregado_a_id = clean_id(body.get('entregado_a', f"t_{reg.entregado_a_id}"))
            reg.concepto = body.get('concepto', reg.concepto)
            reg.valor = Decimal(str(body.get('valor', reg.valor)))
            reg.comercio = body.get('comercio', reg.comercio)
            reg.factura = body.get('factura', reg.factura)
            reg.numero_recibo = body.get('numero_recibo', reg.numero_recibo)
            if 'soporte' in body:
                reg.soporte = body.get('soporte')
            reg.save()
            return JsonResponse({'success': True})
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)

    elif request.method == 'DELETE':
        if request.user.perfil.rol != 'Administrador':
            return JsonResponse({'error': 'Forbidden'}, status=403)
        reg.delete()
        return JsonResponse({'success': True})

# Modulo 2: Pago Pendiente REST API
@csrf_exempt
def api_pagos(request):
    if not request.user.is_authenticated:
        return JsonResponse({'error': 'Unauthorized'}, status=401)

    if request.method == 'GET':
        pagos = PagoPendiente.objects.all().order_by('-fecha')
        data = [{
            'id': f"m2_{p.id}",
            'fecha': p.fecha.isoformat(),
            'valor': float(p.valor),
            'se_debe_a': f"t_{p.se_debe_a_id}",
            'concepto': p.concepto,
            'factura': p.factura or '',
            'recibo': p.recibo or '',
            'reportado': p.reportado,
            'soporte': p.soporte or ''
        } for p in pagos]
        return JsonResponse(data, safe=False)

    elif request.method == 'POST':
        if not check_permission(request.user, 'write', 'modulo2'):
            return JsonResponse({'error': 'Forbidden'}, status=403)
        try:
            body = json.loads(request.body)
            colab_id = clean_id(body.get('se_debe_a'))
            pago = PagoPendiente.objects.create(
                fecha=parse_date(body.get('fecha')),
                valor=Decimal(str(body.get('valor'))),
                se_debe_a_id=colab_id,
                concepto=body.get('concepto'),
                factura=body.get('factura', ''),
                recibo=body.get('recibo', ''),
                reportado=body.get('reportado', False),
                soporte=body.get('soporte', '')
            )
            return JsonResponse({'success': True, 'id': f"m2_{pago.id}"})
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)

@csrf_exempt
def api_pago_detail(request, pk):
    if not request.user.is_authenticated:
        return JsonResponse({'error': 'Unauthorized'}, status=401)
    try:
        pago = PagoPendiente.objects.get(pk=pk)
    except PagoPendiente.DoesNotExist:
        return JsonResponse({'error': 'Not found'}, status=404)

    if request.method == 'PUT':
        # Admin or designated module operator can write
        if not check_permission(request.user, 'write', 'modulo2'):
            return JsonResponse({'error': 'Forbidden'}, status=403)
        try:
            body = json.loads(request.body)
            # Handle toggle status report
            if 'reportado' in body and len(body) == 1:
                pago.reportado = body.get('reportado')
            else:
                pago.fecha = parse_date(body.get('fecha', pago.fecha.isoformat()))
                pago.valor = Decimal(str(body.get('valor', pago.valor)))
                pago.se_debe_a_id = clean_id(body.get('se_debe_a', f"t_{pago.se_debe_a_id}"))
                pago.concepto = body.get('concepto', pago.concepto)
                pago.factura = body.get('factura', pago.factura)
                pago.recibo = body.get('recibo', pago.recibo)
                pago.reportado = body.get('reportado', pago.reportado)
                if 'soporte' in body:
                    pago.soporte = body.get('soporte')
            pago.save()
            return JsonResponse({'success': True})
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)

    elif request.method == 'DELETE':
        if request.user.perfil.rol != 'Administrador':
            return JsonResponse({'error': 'Forbidden'}, status=403)
        pago.delete()
        return JsonResponse({'success': True})

# Modulo 3: Efectivo Ventas REST API
@csrf_exempt
def api_ventas(request):
    if not request.user.is_authenticated:
        return JsonResponse({'error': 'Unauthorized'}, status=401)

    if request.method == 'GET':
        ventas = EfectivoVentas.objects.all().order_by('-fecha')
        data = [{
            'id': f"m3_{v.id}",
            'fecha': v.fecha.isoformat(),
            'valor_entregado': float(v.valor_entregado),
            'quien_entrega': f"t_{v.quien_entrega_id}",
            'concepto': v.concepto,
            'estado_entrega': v.estado_entrega,
            'entregado_a': f"t_{v.entregado_a_id}" if v.entregado_a_id else None,
            'fecha_entrega': v.fecha_entrega.isoformat() if v.fecha_entrega else None,
            'observaciones': v.observaciones or '',
            'soporte': v.soporte or ''
        } for v in ventas]
        return JsonResponse(data, safe=False)

    elif request.method == 'POST':
        if not check_permission(request.user, 'write', 'modulo3'):
            return JsonResponse({'error': 'Forbidden'}, status=403)
        try:
            body = json.loads(request.body)
            entregado_a_val = body.get('entregado_a')
            entregado_a_id = clean_id(entregado_a_val) if entregado_a_val else None
            fecha_entrega_val = body.get('fecha_entrega')
            fecha_entrega = parse_date(fecha_entrega_val) if fecha_entrega_val else None

            venta = EfectivoVentas.objects.create(
                fecha=parse_date(body.get('fecha')),
                valor_entregado=Decimal(str(body.get('valor_entregado'))),
                quien_entrega_id=clean_id(body.get('quien_entrega')),
                concepto=body.get('concepto'),
                estado_entrega=body.get('estado_entrega', False),
                entregado_a_id=entregado_a_id,
                fecha_entrega=fecha_entrega,
                observaciones=body.get('observaciones', ''),
                soporte=body.get('soporte', '')
            )
            return JsonResponse({'success': True, 'id': f"m3_{venta.id}"})
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)

@csrf_exempt
def api_venta_detail(request, pk):
    if not request.user.is_authenticated:
        return JsonResponse({'error': 'Unauthorized'}, status=401)
    try:
        venta = EfectivoVentas.objects.get(pk=pk)
    except EfectivoVentas.DoesNotExist:
        return JsonResponse({'error': 'Not found'}, status=404)

    if request.method == 'PUT':
        if not check_permission(request.user, 'write', 'modulo3'):
            return JsonResponse({'error': 'Forbidden'}, status=403)
        try:
            body = json.loads(request.body)
            # Handle quick delivery confirmation
            if 'estado_entrega' in body and len(body) == 3 and 'entregado_a' in body and 'fecha_entrega' in body:
                venta.estado_entrega = body.get('estado_entrega')
                venta.entregado_a_id = clean_id(body.get('entregado_a'))
                venta.fecha_entrega = parse_date(body.get('fecha_entrega'))
            else:
                venta.fecha = parse_date(body.get('fecha', venta.fecha.isoformat()))
                venta.valor_entregado = Decimal(str(body.get('valor_entregado', venta.valor_entregado)))
                venta.quien_entrega_id = clean_id(body.get('quien_entrega', f"t_{venta.quien_entrega_id}"))
                venta.concepto = body.get('concepto', venta.concepto)
                venta.estado_entrega = body.get('estado_entrega', venta.estado_entrega)
                
                entregado_a_val = body.get('entregado_a')
                venta.entregado_a_id = clean_id(entregado_a_val) if entregado_a_val else None
                
                fecha_entrega_val = body.get('fecha_entrega')
                venta.fecha_entrega = parse_date(fecha_entrega_val) if fecha_entrega_val else None
                
                venta.observaciones = body.get('observaciones', venta.observaciones)
                if 'soporte' in body:
                    venta.soporte = body.get('soporte')
            venta.save()
            return JsonResponse({'success': True})
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)

    elif request.method == 'DELETE':
        if request.user.perfil.rol != 'Administrador':
            return JsonResponse({'error': 'Forbidden'}, status=403)
        venta.delete()
        return JsonResponse({'success': True})

# User Admin CRUD REST API
@csrf_exempt
def api_usuarios(request):
    if not request.user.is_authenticated or request.user.perfil.rol != 'Administrador':
        return JsonResponse({'error': 'Forbidden'}, status=403)

    if request.method == 'GET':
        usuarios = User.objects.all().order_by('username')
        data = [{
            'id': f"u_{u.id}",
            'nombre': u.first_name,
            'usuario': u.username,
            'rol': u.perfil.rol,
            'modulo': u.perfil.modulo or ''
        } for u in usuarios]
        return JsonResponse(data, safe=False)

    elif request.method == 'POST':
        try:
            body = json.loads(request.body)
            username = body.get('usuario')
            if User.objects.filter(username=username).exists():
                return JsonResponse({'error': f'El nombre de usuario "{username}" ya está en uso.'}, status=400)
            
            user = User.objects.create_user(
                username=username,
                password=body.get('contrasena'),
                first_name=body.get('nombre')
            )
            PerfilUsuario.objects.create(
                user=user,
                rol=body.get('rol'),
                modulo=body.get('modulo')
            )
            return JsonResponse({'success': True, 'id': f"u_{user.id}"})
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)

@csrf_exempt
def api_usuario_detail(request, pk):
    if not request.user.is_authenticated or request.user.perfil.rol != 'Administrador':
        return JsonResponse({'error': 'Forbidden'}, status=403)
    try:
        user = User.objects.get(pk=pk)
    except User.DoesNotExist:
        return JsonResponse({'error': 'Not found'}, status=404)

    if request.method == 'PUT':
        try:
            body = json.loads(request.body)
            user.first_name = body.get('nombre', user.first_name)
            if 'contrasena' in body and body.get('contrasena'):
                user.set_password(body.get('contrasena'))
            user.save()
            
            perfil = user.perfil
            perfil.rol = body.get('rol', perfil.rol)
            perfil.modulo = body.get('modulo', perfil.modulo)
            perfil.save()
            return JsonResponse({'success': True})
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)

    elif request.method == 'DELETE':
        if request.user.id == user.id:
            return JsonResponse({'error': 'No puedes eliminar tu propio usuario administrador activo.'}, status=400)
        user.delete()
        return JsonResponse({'success': True})

# Export Database backup
def api_database_export(request):
    if not request.user.is_authenticated or request.user.perfil.rol != 'Administrador':
        return JsonResponse({'error': 'Forbidden'}, status=403)

    # Gather data from all modules
    colaboradores = [{'id': f"t_{c.id}", 'nombre': c.nombre, 'tipo': c.tipo, 'documento': c.documento, 'telefono': c.telefono} for c in Colaborador.objects.all()]
    caja = [{
        'id': f"m1_{r.id}",
        'fecha': r.fecha.isoformat(),
        'tipo_movimiento': r.tipo_movimiento,
        'entregado_a': f"t_{r.entregado_a_id}",
        'concepto': r.concepto,
        'valor': float(r.valor),
        'comercio': r.comercio or '',
        'factura': r.factura or '',
        'numero_recibo': r.numero_recibo or '',
        'soporte': r.soporte or ''
    } for r in RegistroCaja.objects.all()]
    pagos = [{
        'id': f"m2_{p.id}",
        'fecha': p.fecha.isoformat(),
        'valor': float(p.valor),
        'se_debe_a': f"t_{p.se_debe_a_id}",
        'concepto': p.concepto,
        'factura': p.factura or '',
        'recibo': p.recibo or '',
        'reportado': p.reportado,
        'soporte': p.soporte or ''
    } for p in PagoPendiente.objects.all()]
    ventas = [{
        'id': f"m3_{v.id}",
        'fecha': v.fecha.isoformat(),
        'valor_entregado': float(v.valor_entregado),
        'quien_entrega': f"t_{v.quien_entrega_id}",
        'concepto': v.concepto,
        'estado_entrega': v.estado_entrega,
        'entregado_a': f"t_{v.entregado_a_id}" if v.entregado_a_id else None,
        'fecha_entrega': v.fecha_entrega.isoformat() if v.fecha_entrega else None,
        'observaciones': v.observaciones or '',
        'soporte': v.soporte or ''
    } for v in EfectivoVentas.objects.all()]
    usuarios = [{
        'id': f"u_{u.id}",
        'nombre': u.first_name,
        'usuario': u.username,
        'rol': u.perfil.rol,
        'modulo': u.perfil.modulo or ''
    } for u in User.objects.all()]

    export_data = {
        'version': '3.0.0-django-postgres',
        'exportado_el': parse_date('2026-07-08').isoformat() if hasattr(parse_date('2026-07-08'), 'isoformat') else '2026-07-08',
        'base_de_datos': {
            'modulo0': colaboradores,
            'modulo1': caja,
            'modulo2': pagos,
            'modulo3': ventas,
            'usuarios': usuarios
        }
    }
    
    response = HttpResponse(json.dumps(export_data, indent=4), content_type='application/json')
    response['Content-Disposition'] = 'attachment; filename="sistema_caja_backup_django.json"'
    return response

# Import/Restore Database backup
@csrf_exempt
def api_database_import(request):
    if not request.user.is_authenticated or request.user.perfil.rol != 'Administrador':
        return JsonResponse({'error': 'Forbidden'}, status=403)

    if request.method != 'POST':
        return JsonResponse({'error': 'Method not allowed'}, status=405)

    try:
        body = json.loads(request.body)
        db_data = body.get('base_de_datos')
        if not db_data or 'modulo0' not in db_data or 'modulo1' not in db_data or 'modulo2' not in db_data or 'modulo3' not in db_data:
            return JsonResponse({'error': 'Formato de archivo V3 incompatible.'}, status=400)

        # Clear existing transactional records
        RegistroCaja.objects.all().delete()
        PagoPendiente.objects.all().delete()
        EfectivoVentas.objects.all().delete()
        Colaborador.objects.all().delete()

        # Import Colaboradores
        colab_id_map = {}
        for c in db_data.get('modulo0', []):
            original_id = c.get('id')
            c_obj = Colaborador.objects.create(
                id=clean_id(original_id),
                nombre=c.get('nombre'),
                tipo=c.get('tipo'),
                documento=c.get('documento'),
                telefono=c.get('telefono', '')
            )
            colab_id_map[original_id] = c_obj.id

        # Import Modulo 1: Registro Caja
        for r in db_data.get('modulo1', []):
            RegistroCaja.objects.create(
                id=clean_id(r.get('id')),
                fecha=parse_date(r.get('fecha')),
                tipo_movimiento=r.get('tipo_movimiento'),
                entregado_a_id=colab_id_map.get(r.get('entregado_a')),
                concepto=r.get('concepto'),
                valor=Decimal(str(r.get('valor'))),
                comercio=r.get('comercio', ''),
                factura=r.get('factura', ''),
                numero_recibo=r.get('numero_recibo', ''),
                soporte=r.get('soporte', '')
            )

        # Import Modulo 2: Pagos Pendientes
        for p in db_data.get('modulo2', []):
            PagoPendiente.objects.create(
                id=clean_id(p.get('id')),
                fecha=parse_date(p.get('fecha')),
                valor=Decimal(str(p.get('valor'))),
                se_debe_a_id=colab_id_map.get(p.get('se_debe_a')),
                concepto=p.get('concepto'),
                factura=p.get('factura', ''),
                recibo=p.get('recibo', ''),
                reportado=p.get('reportado', False),
                soporte=p.get('soporte', '')
            )

        # Import Modulo 3: Efectivo Ventas
        for v in db_data.get('modulo3', []):
            entregado_a_val = v.get('entregado_a')
            entregado_a_id = colab_id_map.get(entregado_a_val) if entregado_a_val else None
            fecha_entrega_val = v.get('fecha_entrega')
            fecha_entrega = parse_date(fecha_entrega_val) if fecha_entrega_val else None

            EfectivoVentas.objects.create(
                id=clean_id(v.get('id')),
                fecha=parse_date(v.get('fecha')),
                valor_entregado=Decimal(str(v.get('valor_entregado'))),
                quien_entrega_id=colab_id_map.get(v.get('quien_entrega')),
                concepto=v.get('concepto'),
                estado_entrega=v.get('estado_entrega', False),
                entregado_a_id=entregado_a_id,
                fecha_entrega=fecha_entrega,
                observaciones=v.get('observaciones', ''),
                soporte=v.get('soporte', '')
            )

        # Optional: Import Users if present
        if 'usuarios' in db_data:
            for u in db_data.get('usuarios', []):
                # Don't delete active request user to avoid session termination
                u_id_clean = clean_id(u.get('id'))
                if u_id_clean == request.user.id:
                    continue
                User.objects.filter(username=u.get('usuario')).exclude(id=request.user.id).delete()
                new_u = User.objects.create_user(
                    id=u_id_clean,
                    username=u.get('usuario'),
                    password='caja' if u.get('rol') == 'Operador de Módulo' else '123', # Fallback passwords
                    first_name=u.get('nombre')
                )
                PerfilUsuario.objects.get_or_create(
                    user=new_u,
                    rol=u.get('rol'),
                    modulo=u.get('modulo')
                )

        return JsonResponse({'success': True})
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)
