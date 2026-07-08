from django.urls import path
from . import views

urlpatterns = [
    path('', views.index_view, name='index'),
    path('api/auth/login/', views.api_login, name='api_login'),
    path('api/auth/logout/', views.api_logout, name='api_logout'),
    path('api/auth/session/', views.api_session, name='api_session'),
    path('api/colaboradores/', views.api_colaboradores, name='api_colaboradores'),
    path('api/colaboradores/<int:pk>/', views.api_colaborador_detail, name='api_colaborador_detail'),
    path('api/caja/', views.api_caja, name='api_caja'),
    path('api/caja/<int:pk>/', views.api_caja_detail, name='api_caja_detail'),
    path('api/pagos/', views.api_pagos, name='api_pagos'),
    path('api/pagos/<int:pk>/', views.api_pago_detail, name='api_pago_detail'),
    path('api/ventas/', views.api_ventas, name='api_ventas'),
    path('api/ventas/<int:pk>/', views.api_venta_detail, name='api_venta_detail'),
    path('api/usuarios/', views.api_usuarios, name='api_usuarios'),
    path('api/usuarios/<int:pk>/', views.api_usuario_detail, name='api_usuario_detail'),
    path('api/database/export/', views.api_database_export, name='api_database_export'),
    path('api/database/import/', views.api_database_import, name='api_database_import'),
]
