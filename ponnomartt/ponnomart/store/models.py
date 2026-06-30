from django.db import models

class Product(models.Model):
    product_ID = models.CharField(max_length=20, primary_key=True)
    product_Name = models.CharField(max_length=100)
    product_Category = models.CharField(max_length=50, blank=True, null=True)
    Price_BDT = models.DecimalField(max_digits=10, decimal_places=2)
    Quantity = models.PositiveIntegerField()
    Company = models.CharField(max_length=50, blank=True, null=True)
    Stock_Status = models.CharField(max_length=20, blank=True, null=True)
    Discount = models.CharField(max_length=10, blank=True, null=True)
    image = models.ImageField(upload_to='product_images/', blank=True, null=True)  # Product image

    def __str__(self):
        return self.product_Name



# Category-specific tables
class Groceries(models.Model):
    product = models.OneToOneField(Product, on_delete=models.CASCADE, primary_key=True)
    groc_Review = models.TextField(blank=True, null=True)
    groc_Rate = models.DecimalField(max_digits=3, decimal_places=1, blank=True, null=True)
    groc_Size = models.CharField(max_length=20, blank=True, null=True)
    mfg_date = models.DateField(blank=True, null=True)
    Exp_Date = models.DateField(blank=True, null=True)


class StationaryProducts(models.Model):
    product = models.OneToOneField(Product, on_delete=models.CASCADE, primary_key=True)
    Size_Specs = models.CharField(max_length=50, blank=True, null=True)
    Color = models.CharField(max_length=30, blank=True, null=True)
    Material = models.CharField(max_length=50, blank=True, null=True)
    Review = models.TextField(blank=True, null=True)
    Rating = models.DecimalField(max_digits=3, decimal_places=2, blank=True, null=True)


class SkinCareProducts(models.Model):
    product = models.OneToOneField(Product, on_delete=models.CASCADE, primary_key=True)
    Ingredients = models.TextField(blank=True, null=True)
    Sc_Size = models.CharField(max_length=50, blank=True, null=True)
    Review = models.TextField(blank=True, null=True)
    Rating = models.DecimalField(max_digits=3, decimal_places=2, blank=True, null=True)


class Book(models.Model):
    product = models.OneToOneField(Product, on_delete=models.CASCADE, primary_key=True)
    Author = models.CharField(max_length=100, blank=True, null=True)
    Publisher = models.CharField(max_length=100, blank=True, null=True)
    b_Language = models.CharField(max_length=50, blank=True, null=True)
    b_Pages = models.PositiveIntegerField(blank=True, null=True)
    Genre = models.CharField(max_length=50, blank=True, null=True)
    Review = models.TextField(blank=True, null=True)
    Rating = models.DecimalField(max_digits=3, decimal_places=2, blank=True, null=True)


class HomeAppliances(models.Model):
    product = models.OneToOneField(Product, on_delete=models.CASCADE, primary_key=True)
    Power_Usage = models.CharField(max_length=20, blank=True, null=True)
    Dimensions = models.CharField(max_length=50, blank=True, null=True)
    Warranty = models.CharField(max_length=50, blank=True, null=True)
    Energy_Rating = models.CharField(max_length=10, blank=True, null=True)
    Review = models.TextField(blank=True, null=True)
    Rating = models.DecimalField(max_digits=3, decimal_places=2, blank=True, null=True)


class ComputerComponents(models.Model):
    product = models.OneToOneField(Product, on_delete=models.CASCADE, primary_key=True)
    Component_Type = models.CharField(max_length=50, blank=True, null=True)
    Specs = models.TextField(blank=True, null=True)
    Compatibility = models.CharField(max_length=100, blank=True, null=True)
    Warranty = models.CharField(max_length=50, blank=True, null=True)
    Review = models.TextField(blank=True, null=True)
    Rating = models.DecimalField(max_digits=3, decimal_places=2, blank=True, null=True)


class Electronics(models.Model):
    product = models.OneToOneField(Product, on_delete=models.CASCADE, primary_key=True)
    Model = models.CharField(max_length=50, blank=True, null=True)
    Warranty = models.CharField(max_length=50, blank=True, null=True)
    Power_Usage = models.CharField(max_length=20, blank=True, null=True)
    Dimensions = models.CharField(max_length=50, blank=True, null=True)
    Energy_Rating = models.CharField(max_length=10, blank=True, null=True)
    Review = models.TextField(blank=True, null=True)
    Rating = models.DecimalField(max_digits=3, decimal_places=2, blank=True, null=True)


# Subcategories of Electronics
class Laptop_Desktop(models.Model):
    product = models.OneToOneField(Electronics, on_delete=models.CASCADE, primary_key=True)
    Processor = models.CharField(max_length=50, blank=True, null=True)
    RAM = models.CharField(max_length=50, blank=True, null=True)
    Storage = models.CharField(max_length=50, blank=True, null=True)
    Graphics_Card = models.CharField(max_length=50, blank=True, null=True)
    Operating_System = models.CharField(max_length=50, blank=True, null=True)


class Smartphone_Tablet(models.Model):
    product = models.OneToOneField(Electronics, on_delete=models.CASCADE, primary_key=True)
    OS = models.CharField(max_length=50, blank=True, null=True)
    RAM = models.CharField(max_length=50, blank=True, null=True)
    Storage = models.CharField(max_length=50, blank=True, null=True)
    Camera_Specs = models.CharField(max_length=100, blank=True, null=True)
    Battery_Capacity = models.CharField(max_length=50, blank=True, null=True)


class Camera(models.Model):
    product = models.OneToOneField(Electronics, on_delete=models.CASCADE, primary_key=True)
    Camera_Type = models.CharField(max_length=50, blank=True, null=True)
    Resolution = models.CharField(max_length=50, blank=True, null=True)
    Lens_Specs = models.CharField(max_length=100, blank=True, null=True)
    Battery_Capacity = models.CharField(max_length=50, blank=True, null=True)


class Powerbank(models.Model):
    product = models.OneToOneField(Electronics, on_delete=models.CASCADE, primary_key=True)
    Capacity_mAh = models.CharField(max_length=50, blank=True, null=True)
    Output_Ports = models.CharField(max_length=50, blank=True, null=True)
    Input_Type = models.CharField(max_length=50, blank=True, null=True)


class Bluetooth_Speaker(models.Model):
    product = models.OneToOneField(Electronics, on_delete=models.CASCADE, primary_key=True)
    Battery_Capacity = models.CharField(max_length=50, blank=True, null=True)
    Output_Power = models.CharField(max_length=50, blank=True, null=True)
    Connectivity = models.CharField(max_length=50, blank=True, null=True)


class Order(models.Model):
    name = models.CharField(max_length=200, default="Anonymous")  # instead of fullname
    email = models.EmailField()
    phone = models.CharField(max_length=20)
    address = models.TextField()
    payment_method = models.CharField(max_length=50)
    subtotal = models.DecimalField(max_digits=10, decimal_places=2)
    shipping = models.DecimalField(max_digits=10, decimal_places=2)
    total = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=50, default='Pending')
    created_at = models.DateTimeField(auto_now_add=True)


class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name="items")
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField()
    price = models.FloatField()  # price per unit

    def __str__(self):
        return f"{self.product.name} x {self.quantity}"

class Payment(models.Model):
    STATUS_CHOICES = [
        ("pending", "Pending"),
        ("completed", "Completed"),
        ("failed", "Failed"),
    ]
    order = models.OneToOneField(Order, on_delete=models.CASCADE, related_name="payment")
    payment_method = models.CharField(max_length=50)
    transaction_id = models.CharField(max_length=255, blank=True, null=True)
    amount = models.FloatField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="pending")
    created_at = models.DateTimeField(auto_now_add=True)

from django.contrib.auth.models import AbstractUser, Group, Permission
from django.db import models

class CustomUser(AbstractUser):
    is_supercreator = models.BooleanField(default=False)

    groups = models.ManyToManyField(
        Group,
        related_name="customuser_set",
        blank=True,
        help_text="The groups this user belongs to.",
        verbose_name="groups",
    )
    user_permissions = models.ManyToManyField(
        Permission,
        related_name="customuser_set",
        blank=True,
        help_text="Specific permissions for this user.",
        verbose_name="user permissions",
    )

