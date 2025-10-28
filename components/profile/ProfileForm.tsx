
'use client';

import { useState } from 'react';
import { User } from '@/types/user';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Save, Edit } from 'lucide-react';
import Image from 'next/image';
import { Switch } from '../ui/Switch';

interface ProfileFormProps {
  user: User;
  onSave: (userData: Partial<User>) => void;
}

export function ProfileForm({ user, onSave }: ProfileFormProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    phone: user.phone,
    location: user.location,
    bio: user.bio,
    preferences: user.preferences
  });

  const handleSave = () => {
    onSave(formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      name: user.name,
      email: user.email,
      phone: user.phone,
      location: user.location,
      bio: user.bio,
      preferences: user.preferences
    });
    setIsEditing(false);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">Dados Pessoais</h3>
        {!isEditing ? (
          <Button variant="outline" onClick={() => setIsEditing(true)}>
            <Edit className="w-4 h-4 mr-2" />
            Editar
          </Button>
        ) : (
          <div className="flex space-x-2">
            <Button variant="outline" onClick={handleCancel}>
              Cancelar
            </Button>
            <Button onClick={handleSave}>
              <Save className="w-4 h-4 mr-2" />
              Salvar
            </Button>
          </div>
        )}
      </div>

      <div className="space-y-6">
        {/* Foto de Perfil */}
        <div className="flex items-center space-x-4">
          <div className="relative h-20 w-20">
            <Image
              src={user.avatar}
              alt={user.name}
              fill
              className="rounded-full object-cover"
            />
          </div>
          {isEditing && (
            <Button variant="outline" size="sm">
              Alterar Foto
            </Button>
          )}
        </div>

        {/* Formulário */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">Nome Completo</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              disabled={!isEditing}
            />
          </div>
          
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              disabled={!isEditing}
            />
          </div>
          
          <div>
            <Label htmlFor="phone">Telefone</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              disabled={!isEditing}
            />
          </div>
          
          <div>
            <Label htmlFor="location">Localização</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
              disabled={!isEditing}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="bio">Biografia</Label>
          <Textarea
            id="bio"
            value={formData.bio}
            onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
            disabled={!isEditing}
            placeholder="Conte um pouco sobre você..."
            rows={4}
          />
        </div>

        {/* Preferências */}
        <div className="border-t pt-6">
          <h4 className="font-medium mb-4">Preferências de Notificação</h4>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="notifications" className="font-normal">
                  Notificações no App
                </Label>
                <p className="text-sm text-gray-500">
                  Receba lembretes de sessões e atualizações
                </p>
              </div>
              <Switch
                id="notifications"
                checked={formData.preferences.notifications}
                onCheckedChange={(checked) => 
                  setFormData(prev => ({
                    ...prev,
                    preferences: { ...prev.preferences, notifications: checked }
                  }))
                }
                disabled={!isEditing}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="emailUpdates" className="font-normal">
                  Emails de Atualização
                </Label>
                <p className="text-sm text-gray-500">
                  Receba novidades e dicas por email
                </p>
              </div>
              <Switch
                id="emailUpdates"
                checked={formData.preferences.emailUpdates}
                onCheckedChange={(checked) => 
                  setFormData(prev => ({
                    ...prev,
                    preferences: { ...prev.preferences, emailUpdates: checked }
                  }))
                }
                disabled={!isEditing}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="smsReminders" className="font-normal">
                  Lembretes por SMS
                </Label>
                <p className="text-sm text-gray-500">
                  Receba SMS antes das sessões
                </p>
              </div>
              <Switch
                id="smsReminders"
                checked={formData.preferences.smsReminders}
                onCheckedChange={(checked) => 
                  setFormData(prev => ({
                    ...prev,
                    preferences: { ...prev.preferences, smsReminders: checked }
                  }))
                }
                disabled={!isEditing}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}