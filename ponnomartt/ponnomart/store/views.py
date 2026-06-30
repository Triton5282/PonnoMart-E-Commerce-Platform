from django.shortcuts import render, get_object_or_404
from .models import Product
from django.shortcuts import render, redirect
from django.contrib import messages
from .models import Product, Order, OrderItem, Payment

def home(request):
    products = Product.objects.all()  # fetch all products
    return render(request, 'home.html', {'products': products})


def browse(request):
    products = Product.objects.all()

    # Handle multiple categories
    categories = request.GET.getlist('category')  # returns a list
    if categories:
        products = products.filter(Category__in=categories)  # __in handles multiple

    # Handle price filter
    max_price = request.GET.get('price')
    if max_price:
        try:
            max_price = float(max_price)
            products = products.filter(Price_BDT__lte=max_price)
        except ValueError:
            pass  # ignore invalid input

    return render(request, 'browse.html', {'products': products})

def product_detail(request, pk):
    product = get_object_or_404(Product, pk=pk)
    return render(request, 'product_detail.html', {'product': product})

def cart(request):
    return render(request, 'cart.html')


def account(request):
    return render(request, 'account.html')


def search(request):
    query = request.GET.get('q', '')  # fix GET param
    category = request.GET.get('category', '')

    results = Product.objects.all()

    if query:
        results = results.filter(product_Name__icontains=query)

    if category:
        results = results.filter(product_Category__icontains=category)

    return render(
        request,
        'search_results.html',
        {
            'results': results,
            'query': query,
            'category': category
        }
    )



from django.shortcuts import render, redirect
from django.urls import reverse
from .models import Order, OrderItem, Payment, Product
from django.contrib import messages

def checkout(request):
    cart = request.session.get('cart', [])  # or however you store cart
    subtotal = sum(item['price'] * item['quantity'] for item in cart)
    shipping = 5  # default, or calculate based on address
    total = subtotal + shipping

    if request.method == "POST":
        name = request.POST.get('fullname') or request.POST.get('name')
        email = request.POST.get('email')
        phone = request.POST.get('phone')
        address = request.POST.get('address')
        payment_method = request.POST.get('payment')

        # Create the Order
        order = Order.objects.create(
            name=name,
            email=email,
            phone=phone,
            address=address,
            payment_method=payment_method,
            subtotal=subtotal,
            shipping=shipping,
            total=total,
            status='Pending'
        )

        # Create OrderItems
        for item in cart:
            product = Product.objects.get(id=item['id'])
            OrderItem.objects.create(
                order=order,
                product=product,
                quantity=item['quantity'],
                price=item['price']
            )

        # Create Payment record (optional, if payment_method requires it)
        Payment.objects.create(
            order=order,
            payment_method=payment_method,
            amount=total,
            status='pending'
        )

        # Clear cart after order
        request.session['cart'] = []

        messages.success(request, "Order placed successfully!")
        return redirect('home')  # redirect to homepage or order success page

    return render(request, 'checkout.html', {
        'cart': cart,
        'subtotal': subtotal,
        'shipping': shipping,
        'total': total
    })



from django.shortcuts import render, get_object_or_404
from .models import Product

def product_detail(request, pk):
    product = get_object_or_404(Product, pk=pk)
    
    # Determine category-specific data
    category_data = None
    category_specs = {}
    if hasattr(product, 'groceries'):
        category_data = product.groceries
    elif hasattr(product, 'stationaryproducts'):
        category_data = product.stationaryproducts
    elif hasattr(product, 'skincareproducts'):
        category_data = product.skincareproducts
    elif hasattr(product, 'book'):
        category_data = product.book
    elif hasattr(product, 'homeappliances'):
        category_data = product.homeappliances
    elif hasattr(product, 'computercomponents'):
        category_data = product.computercomponents
    elif hasattr(product, 'electronics'):
        category_data = product.electronics

    # Build a dictionary of field_name: value for the template
    if category_data:
        for field in category_data._meta.get_fields():
            if getattr(field, 'concrete', False) and field.name != 'product':
                category_specs[field.verbose_name] = getattr(category_data, field.name)

    context = {
        'product': product,
        'category_specs': category_specs,
    }
    return render(request, 'product_detail.html', context)


from django.http import JsonResponse
from .models import Product

def shopbot_api(request):
    query = request.GET.get('q', '')
    products = Product.objects.filter(product_Name__icontains=query)

    product_list = []
    for p in products:
        product_list.append({
            "name": p.product_Name,
            "category": p.product_Category,
            "price": p.Price_BDT,
            "stock": p.Stock_Status,
            "description": getattr(p, 'Description', 'No description available.')
        })

    if products.exists():
        reply = f"Found {products.count()} product(s) matching '{query}':"
    else:
        reply = f"No products found for '{query}'."

    return JsonResponse({
        "reply": reply,
        "products": product_list
    })

from django.shortcuts import render, redirect
from django.contrib.auth.models import User
from django.contrib import messages
from django.contrib.auth import login

def signup_view(request):
    if request.method == 'POST':
        username = request.POST['email']  # using email as username
        password = request.POST['password']
        full_name = request.POST['fullname']
        if User.objects.filter(username=username).exists():
            messages.error(request, "User already exists")
        else:
            user = User.objects.create_user(username=username, password=password, first_name=full_name)
            login(request, user)
            return redirect('home')
    return redirect('home')
