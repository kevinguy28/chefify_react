from django.db.models.signals import m2m_changed
from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from .models import Recipe, Review

@receiver(post_save, sender=Review)
def update_recipe_rating(sender, instance, **kwargs):
    print("ass")
    # Get the recipe associated with the review
    recipe = instance.recipe
    recipe.update_rating()
    recipe.save()

@receiver(m2m_changed, sender=Recipe.reviewers.through)
def reviewers_changed(sender, instance, action, reverse, model, pk_set, using, **kwargs):
    print('gay af')
    if action in ["post_add", "post_remove"]:
        instance.update_rating()
        instance.save()