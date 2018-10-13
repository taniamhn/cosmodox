import graphene
import core.schema
from graphene_django_extras import all_directives


class Query(
    core.schema.Query,
    graphene.ObjectType
):
    pass

class Mutation(graphene.ObjectType):
    pass

# schema = graphene.Schema(query=Query, mutation=Mutation, directives=all_directives)
schema = graphene.Schema(query=Query, directives=all_directives)