from django.contrib import admin
from .models import PerfilUsuario, Colaborador, RegistroCaja, PagoPendiente, EfectivoVentas

admin.site.register(PerfilUsuario)
admin.site.register(Colaborador)
admin.site.register(RegistroCaja)
admin.site.register(PagoPendiente)
admin.site.register(EfectivoVentas)
