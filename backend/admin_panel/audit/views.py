from django.shortcuts import render

def audit_list(request):
    return render(request, 'audit_list.html', {})
