from django.urls import path
from store import views
from django.contrib.auth import views as auth_views  # <-- Add this line

urlpatterns = [
    path('', views.home, name='home'),
    path('browse/', views.browse, name='browse'),
    path('product/<str:pk>/', views.product_detail, name='product_detail'),
    path('cart/', views.cart, name='cart'),
    path('account/', views.account, name='account'),
    path('search/', views.search, name='search'),
    path('checkout/', views.checkout, name='checkout'),

    # Auth URLs
    path('login/', auth_views.LoginView.as_view(template_name='store/login.html'), name='login'),
    path('logout/', auth_views.LogoutView.as_view(next_page='home'), name='logout'),
    path('signup/', views.signup_view, name='signup'),

    # API URLs
    path('api/shopbot/', views.shopbot_api, name='shopbot_api'),
]
