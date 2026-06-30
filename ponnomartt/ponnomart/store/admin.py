# admin.py
from django.contrib import admin
from .models import Product, Groceries, StationaryProducts, SkinCareProducts, Book, HomeAppliances, ComputerComponents, Electronics

admin.site.register(Product)
admin.site.register(Groceries)
admin.site.register(StationaryProducts)
admin.site.register(SkinCareProducts)
admin.site.register(Book)
admin.site.register(HomeAppliances)
admin.site.register(ComputerComponents)
admin.site.register(Electronics)

from .models import Product, Order, OrderItem, Payment

# Register models
from django.contrib import admin
from .models import Order, OrderItem, Payment

class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0

class OrderAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'email', 'phone', 'total', 'status', 'created_at')
    list_filter = ('status', 'payment_method', 'created_at')
    search_fields = ('name', 'email', 'phone')
    inlines = [OrderItemInline]

admin.site.register(Order, OrderAdmin)

@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    list_display = ("order", "product", "quantity", "price")
    search_fields = ("product__name", "order__name")  # reference related field correctly

@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ("order", "payment_method", "amount", "status", "created_at")
    list_filter = ("status", "payment_method", "created_at")
    search_fields = ("order__name",)  # reference related field correctly

