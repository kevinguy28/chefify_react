# Generated by Django 5.1.1 on 2024-10-01 21:13

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0025_recipe_description'),
    ]

    operations = [
        migrations.AlterField(
            model_name='recipe',
            name='description',
            field=models.TextField(blank=True, max_length=400),
        ),
    ]
