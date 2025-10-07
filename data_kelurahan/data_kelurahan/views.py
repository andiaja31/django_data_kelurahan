from django.http import HttpResponse

def home(request):
    return HttpResponse("<h1>Selamat datang di Sistem Data Kelurahan!</h1>")
