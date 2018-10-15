from django.views.generic import TemplateView
from django.shortcuts import render


class IndexView(TemplateView):
    template_name = 'index.html'

    def get_context_data(self, **kwargs):
        kwargs.update({
            'isAuthenticated': self.request.user.is_authenticated
        })
        return super().get_context_data(**kwargs)
