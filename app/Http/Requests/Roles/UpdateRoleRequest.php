<?php

namespace App\Http\Requests\Roles;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Spatie\Permission\Models\Role;

class UpdateRoleRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $role = $this->route('role');

        return [
            'name' => ['required', 'string', 'max:255', Rule::unique(Role::class)->where('guard_name', $this->input('guard_name', 'web'))->ignore($role->id)],
            'guard_name' => ['sometimes', 'string', 'max:255'],
            'permissions' => ['nullable', 'array'],
            'permissions.*' => ['exists:permissions,id'],
        ];
    }
}
