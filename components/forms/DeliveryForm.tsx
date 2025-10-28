import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Phone, MapPin, User, Mail } from "lucide-react";
// import { ShippingSection } from "../checkout/ShippingSection";
import { InputField } from "../ui/InputField";
import Link from "next/link";
import { Button } from "../ui/button";

export interface DeliveryData {
  contactInfo: {
    name: string;
    email: string;
    phone: string;
  };
  deliveryLocation: string;
  selectedShipping: string | null;
}

export interface DeliveryFormProps {
  onDeliveryChange: (deliveryData: DeliveryData) => void;
  deliveryData: DeliveryData;
}

function DeliveryForm({ onDeliveryChange, deliveryData }: DeliveryFormProps) {
  const handleContactInfoChange = (
    field: keyof typeof deliveryData.contactInfo,
    value: string
  ) => {
    const newContactInfo = {
      ...deliveryData.contactInfo,
      [field]: value,
    };

    onDeliveryChange({
      ...deliveryData,
      contactInfo: newContactInfo,
    });
  };

  const handleDeliveryLocationChange = (value: string) => {
    onDeliveryChange({
      ...deliveryData,
      deliveryLocation: value,
    });
  };

  const handleShippingSelect = (id: string) => {
    onDeliveryChange({
      ...deliveryData,
      selectedShipping: id,
    });
  };

  return (
    <Card className="w-full ">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text">
          <MapPin className="h-5 w-5" />
          Informações de Entrega
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Contact Information */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              label="Nome Completo: *"
              icon={<User className="h-4 w-4" />}
              id="name"
              type="text"
              value={deliveryData.contactInfo.name}
              placeholder="Seu nome completo"
              required
              onChange={(e) => handleContactInfoChange("name", e.target.value)}
            />

            <InputField
              label="Email:"
              icon={<User className="h-4 w-4" />}
              id="email"
              name="email"
              type="text"
              value={deliveryData.contactInfo.email}
              placeholder="Seu email (william@email.com)"
              onChange={(e) => handleContactInfoChange("email", e.target.value)}
            />
          </div>
          <InputField
            label="Telefone de contacto: *"
            icon={<User className="h-4 w-4" />}
            id="contact-phone"
            name="phone"
            type="text"
            value={deliveryData.contactInfo.phone}
            placeholder="+258 84 123 4567"
            required
            onChange={(e) => handleContactInfoChange("phone", e.target.value)}
          />
        </div>

        {/* Delivery Address */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="delivery-location">Localização de Entrega *</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-4 w-4 " />
              <Textarea
                id="delivery-location"
                value={deliveryData.deliveryLocation}
                onChange={(e) => handleDeliveryLocationChange(e.target.value)}
                placeholder="Descreva detalhadamente o endereço de entrega (ex: Av. Salvador Allende, próximo ao Shopping 24...)"
                className="pl-10 min-h-20"
                required
              />
            </div>
            <p className="text-sm text-muted-foreground">
              Seja específico para facilitar a entrega
            </p>
          </div>
        </div>

        {/* Shipping Options */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">
              Forma de Frete
            </h3>
            <Link href={"/free-delivery-zones"}>
              <Button variant={"outline"}>Ver Mapa</Button>
            </Link>
          </div>
          {/* <ShippingSection
            onShippingSelect={handleShippingSelect}
            selectedShipping={deliveryData.selectedShipping}
          /> */}
        </div>
      </CardContent>
    </Card>
  );
}

export default DeliveryForm;
