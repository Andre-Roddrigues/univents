// components/profile/ProfileHeader.tsx
'use client';

import { motion } from 'framer-motion';

interface ProfileHeaderProps {
  userProfile: {
    name: string;
    email: string;
  };
}

export function ProfileHeader({ userProfile }: ProfileHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center mb-8"
    >
      <h1 className="text-4xl font-bold text-foreground mb-4">
        Meu Perfil
      </h1>
      <p className="text-xl text-muted-foreground">
        {userProfile.name ? `Bem-vindo, ${userProfile.name}!` : 'Gerir a tua conta e bilhetes de eventos'}
      </p>
      {userProfile.email && (
        <p className="text-sm text-muted-foreground mt-2">
          {userProfile.email}
        </p>
      )}
    </motion.div>
  );
}