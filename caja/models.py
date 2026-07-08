from django.db import models
from django.contrib.auth.models import User

# User Profile to store role and modulo assignments
class PerfilUsuario(models.Model):
    ROLES = [
        ('Administrador', 'Administrador'),
        ('Visualización', 'Visualización'),
        ('Operador de Módulo', 'Operador de Módulo'),
    ]
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='perfil')
    rol = models.CharField(max_length=50, choices=ROLES, default='Operador de Módulo')
    modulo = models.CharField(max_length=50, blank=True, null=True)  # e.g., 'modulo1', 'modulo2', 'modulo3'

    def __str__(self):
        return f"{self.user.username} - {self.rol}"

# Modulo 0: Colaboradores
class Colaborador(models.Model):
    nombre = models.CharField(max_length=255)
    tipo = models.CharField(max_length=100)  # "Persona Natural" or "Proveedor / Empresa"
    documento = models.CharField(max_length=100)
    telefono = models.CharField(max_length=100, blank=True, null=True)

    def __str__(self):
        return self.nombre

# Modulo 1: Registro Caja Menor
class RegistroCaja(models.Model):
    fecha = models.DateField()
    tipo_movimiento = models.CharField(max_length=50)  # "Entrada" or "Salida"
    entregado_a = models.ForeignKey(Colaborador, on_delete=models.PROTECT, related_name='registros_caja')
    concepto = models.TextField()
    valor = models.DecimalField(max_digits=15, decimal_places=2)
    comercio = models.CharField(max_length=255, blank=True, null=True)
    factura = models.CharField(max_length=255, blank=True, null=True)
    numero_recibo = models.CharField(max_length=255, blank=True, null=True)
    soporte = models.TextField(blank=True, null=True)  # Base64 string for compressed image

    def __str__(self):
        return f"{self.fecha} - {self.tipo_movimiento} - {self.valor}"

# Modulo 2: Pago Pendiente
class PagoPendiente(models.Model):
    fecha = models.DateField()
    valor = models.DecimalField(max_digits=15, decimal_places=2)
    se_debe_a = models.ForeignKey(Colaborador, on_delete=models.PROTECT, related_name='pagos_pendientes')
    concepto = models.TextField()
    factura = models.CharField(max_length=255, blank=True, null=True)
    recibo = models.CharField(max_length=255, blank=True, null=True)
    reportado = models.BooleanField(default=False)
    soporte = models.TextField(blank=True, null=True)  # Base64 string

    def __str__(self):
        return f"{self.fecha} - Pendiente a {self.se_debe_a.nombre} - {self.valor}"

# Modulo 3: Efectivo Ventas
class EfectivoVentas(models.Model):
    fecha = models.DateField()
    valor_entregado = models.DecimalField(max_digits=15, decimal_places=2)
    quien_entrega = models.ForeignKey(Colaborador, on_delete=models.PROTECT, related_name='ventas_entregadas')
    concepto = models.TextField()
    estado_entrega = models.BooleanField(default=False)
    entregado_a = models.ForeignKey(Colaborador, on_delete=models.PROTECT, blank=True, null=True, related_name='ventas_recibidas')
    fecha_entrega = models.DateField(blank=True, null=True)
    observaciones = models.TextField(blank=True, null=True)
    soporte = models.TextField(blank=True, null=True)  # Base64 string

    def __str__(self):
        return f"{self.fecha} - Ventas de {self.quien_entrega.nombre} - {self.valor_entregado}"
