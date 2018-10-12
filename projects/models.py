from django.db import models


class Project(models.Model):

    COMPLETED = 'C'
    IN_PROCESS = 'EP'
    SUSPENDED = 'S'
    STATES = (
        (COMPLETED, 'Completo'),
        (IN_PROCESS, 'En proceso'),
        (SUSPENDED, 'Suspendido')
    )

    name = models.CharField(max_length=200)
    theme = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    areas = models.ManyToManyField('core.Area')
    vinculated_institutions = models.TextField(blank=True)
    state = models.CharField(max_length=1, choices=STATES, default=IN_PROCESS)
    # usuario = models.ForeignKey('Usuario', blank=True, null=True)
    # grupo_investigacion = models.ForeignKey(
    #     'GrupoInvestigacion', blank=True, null=True)

    def __str__(self):
        return self.name
