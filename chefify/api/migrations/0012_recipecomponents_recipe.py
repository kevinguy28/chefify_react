# Generated by Django 5.0.7 on 2024-08-05 20:57

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0011_ingredientunit_recipecomponents'),
    ]

    operations = [
        migrations.AddField(
            model_name='recipecomponents',
            name='recipe',
            field=models.ForeignKey(default=None, on_delete=django.db.models.deletion.CASCADE, to='api.recipe'),
        ),
    ]
