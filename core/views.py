from django.views.generic import TemplateView
from django.shortcuts import render
from graphene_file_upload.django import FileUploadGraphQLView
from graphene_django_extras.views import ExtraGraphQLView


class IndexView(TemplateView):
    template_name = 'index.html'

    def get_context_data(self, **kwargs):
        kwargs.update({
            'isAuthenticated': 1 if self.request.user.is_authenticated else 0
        })
        return super().get_context_data(**kwargs)


class GraphqlView(FileUploadGraphQLView, ExtraGraphQLView):
    pass
