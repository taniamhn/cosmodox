import graphene
import core.schema
import accounts.schema
import projects.schema
from graphene_django_extras import all_directives


class Query(
    core.schema.Query,
    accounts.schema.Query,
    projects.schema.Query,
    graphene.ObjectType
):
    pass

class Mutation(
    accounts.schema.Mutation,
    projects.schema.Mutation,
    graphene.ObjectType
):
    pass

schema = graphene.Schema(query=Query, mutation=Mutation, directives=all_directives)
# schema = graphene.Schema(query=Query, directives=all_directives)
