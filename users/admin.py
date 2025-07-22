from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User
from django.forms import ModelForm, CharField, PasswordInput

# Custom form for admin user creation & password setting
class UserCreationForm(ModelForm):
    password = CharField(widget=PasswordInput)

    class Meta:
        model = User
        fields = ('contact_number', 'name', 'nic', 'address', 'role', 'password')

    def save(self, commit=True):
        user = super().save(commit=False)
        user.set_password(self.cleaned_data['password'])
        if commit:
            user.save()
        return user

class UserChangeForm(ModelForm):
    class Meta:
        model = User
        fields = ('contact_number', 'name', 'nic', 'address', 'role', 'password', 'is_active', 'is_staff')

    def clean_password(self):
        # Return initial password (hashed) to avoid resetting password accidentally
        return self.initial["password"]

class UserAdmin(BaseUserAdmin):
    form = UserChangeForm
    add_form = UserCreationForm

    list_display = ('contact_number', 'name', 'role', 'is_staff', 'is_active')
    list_filter = ('role', 'is_staff', 'is_active')
    fieldsets = (
        (None, {'fields': ('contact_number', 'password')}),
        ('Personal info', {'fields': ('name', 'nic', 'address', 'role')}),
        ('Permissions', {'fields': ('is_staff', 'is_active', 'is_superuser')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('contact_number', 'name', 'nic', 'address', 'role', 'password'),
        }),
    )
    search_fields = ('contact_number', 'name')
    ordering = ('contact_number',)
    filter_horizontal = ()

admin.site.register(User, UserAdmin)
