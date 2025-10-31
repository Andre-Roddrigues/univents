// app/eventos/agendar/[mentorId]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Container from '@/components/Container';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Mentor, BookingFormData, AvailableSlot } from '@/types/mentorship';
import { ArrowLeft, Calendar, Clock, CreditCard, CheckCircle } from 'lucide-react';
import Image from 'next/image';
import { DateTimeSelector } from '@/components/mentor/DateTimeSelector';
import { PaymentMethod } from '@/components/mentor/PaymentMethod';

// Mock data - substitua por chamada à API
const mockMentor: Mentor = {
    id: '1',
    name: 'Andre Jr',
    title: 'Senior Software Engineer',
    company: 'Tech Solutions Mozambique',
    experience: 8,
    rating: 4.9,
    price: 350,
    location: 'Maputo',
    categories: ['Desenvolvimento Web', 'JavaScript', 'React', 'Node.js'],
    image: '/images/avatar.jpg',
    description: 'Especialista em desenvolvimento full-stack com 8 anos de experiência.',
    availability: ['Segunda a Sexta', '18:00-21:00'],
    availableSlots: [
        {
            date: '2024-01-20', startTime: '18:00', endTime: '19:00', isAvailable: true,
            id: ''
        },
        {
            date: '2024-01-20', startTime: '19:00', endTime: '20:00', isAvailable: true,
            id: ''
        },
        {
            date: '2024-01-20', startTime: '20:00', endTime: '21:00', isAvailable: true,
            id: ''
        },
        {
            date: '2024-01-21', startTime: '18:00', endTime: '19:00', isAvailable: true,
            id: ''
        },
        {
            date: '2024-01-21', startTime: '19:00', endTime: '20:00', isAvailable: false,
            id: ''
        },
        {
            date: '2024-01-22', startTime: '18:00', endTime: '19:00', isAvailable: true,
            id: ''
        },
    ],
    languages: ['Português', 'Inglês'],
    isOnline: true,
    isLocal: true,
};

export default function AgendarPage() {
    const params = useParams();
    const router = useRouter();
    const mentorId = params.mentorId as string;

    const [step, setStep] = useState(1);
    const [bookingData, setBookingData] = useState<BookingFormData>({
        mentorId,
        selectedDate: '',
        selectedTime: '',
        duration: 60, // 1 hora
        sessionType: 'one-time',
        paymentMethod: 'card',
    });

    const [isProcessing, setIsProcessing] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    // Em produção, buscar mentor por ID da API
    const mentor = mockMentor;

    const handleDateSelect = (date: string) => {
        setBookingData(prev => ({ ...prev, selectedDate: date, selectedTime: '' }));
    };

    const handleTimeSelect = (time: string) => {
        setBookingData(prev => ({ ...prev, selectedTime: time }));
    };

    const handlePaymentMethodChange = (method: string) => {
        setBookingData(prev => ({ ...prev, paymentMethod: method as any }));
    };

    const handleConfirmBooking = async () => {
        setIsProcessing(true);

        // Simular processamento
        await new Promise(resolve => setTimeout(resolve, 2000));

        setIsProcessing(false);
        setIsSuccess(true);

        // Redirecionar após sucesso
        setTimeout(() => {
            router.push('/eventos');
        }, 3000);
    };

    const totalAmount = mentor.price * (bookingData.duration / 60);

    if (isSuccess) {
        return (
            <Container>
                <div className="min-h-screen flex items-center justify-center py-12">
                    <div className="text-center">
                        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                            Sessão Agendada com Sucesso!
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 mb-8">
                            Sua sessão com {mentor.name} foi agendada para {bookingData.selectedDate} às {bookingData.selectedTime}
                        </p>
                        <Button onClick={() => router.push('/eventos')}>
                            Voltar para Mentores
                        </Button>
                    </div>
                </div>
            </Container>
        );
    }

    return (
        <Container>
            <div className="py-8">
                {/* Header */}
                <div className="mb-8">
                    <Button
                        variant="ghost"
                        onClick={() => router.back()}
                        className="mb-4 flex items-center gap-2"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Voltar
                    </Button>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        Agendar Sessão
                    </h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Coluna Principal */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Progress Steps */}
                        <div className="flex items-center justify-between max-w-md mx-auto mb-8">
                            {[1, 2, 3].map((stepNumber) => (
                                <div key={stepNumber} className="flex items-center">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= stepNumber
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-gray-200 text-gray-500'
                                        }`}>
                                        {stepNumber}
                                    </div>
                                    {stepNumber < 3 && (
                                        <div className={`w-12 h-1 mx-2 ${step > stepNumber ? 'bg-blue-600' : 'bg-gray-200'
                                            }`} />
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Step 1: Seleção de Data/Horário */}
                        {step === 1 && (
                            <DateTimeSelector
                                mentor={mentor}
                                selectedDate={bookingData.selectedDate}
                                selectedTime={bookingData.selectedTime}
                                onDateSelect={handleDateSelect}
                                onTimeSelect={handleTimeSelect}
                            />
                        )}

                        {step === 2 && (
                            <PaymentMethod
                                selectedMethod={bookingData.paymentMethod}
                                onMethodChange={handlePaymentMethodChange}
                                onCardDetailsChange={(details) => setBookingData(prev => ({ ...prev, cardDetails: details }))}
                                onPhoneNumberChange={(phone) => setBookingData(prev => ({ ...prev, phoneNumber: phone }))}
                                onStudentIdChange={(studentId) => setBookingData(prev => ({ ...prev, studentId }))}
                                onProofUpload={(file) => setBookingData(prev => ({ ...prev, proofFile: file }))}
                                totalAmount={totalAmount}
                            />
                        )}

                        {/* Step 3: Confirmação */}
                        {step === 3 && (
                            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border">
                                <h3 className="text-lg font-semibold mb-4">Confirmar Agendamento</h3>
                                <div className="space-y-4">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Mentor:</span>
                                        <span className="font-medium">{mentor.name}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Data:</span>
                                        <span className="font-medium">
                                            {new Date(bookingData.selectedDate).toLocaleDateString('pt-BR')}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Horário:</span>
                                        <span className="font-medium">{bookingData.selectedTime}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Duração:</span>
                                        <span className="font-medium">{bookingData.duration} minutos</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Método de Pagamento:</span>
                                        <span className="font-medium capitalize">{bookingData.paymentMethod}</span>
                                    </div>
                                    <div className="border-t pt-4">
                                        <div className="flex justify-between text-lg font-bold">
                                            <span>Total:</span>
                                            <span className="text-secondary">MT {totalAmount.toFixed(2)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Navigation Buttons */}
                        <div className="flex justify-between pt-6">
                            <Button
                                variant="outline"
                                onClick={() => setStep(step - 1)}
                                disabled={step === 1}
                            >
                                Anterior
                            </Button>

                            {step < 3 ? (
                                <Button
                                    onClick={() => setStep(step + 1)}
                                    disabled={
                                        (step === 1 && (!bookingData.selectedDate || !bookingData.selectedTime)) ||
                                        (step === 2 && !bookingData.paymentMethod)
                                    }
                                >
                                    Continuar
                                </Button>
                            ) : (
                                <Button
                                    onClick={handleConfirmBooking}
                                    disabled={isProcessing}
                                    className="bg-primary hover:bg-primary/90"
                                >
                                    {isProcessing ? 'Processando...' : 'Confirmar Agendamento'}
                                </Button>
                            )}
                        </div>
                    </div>

                    {/* Sidebar - Resumo */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24 space-y-6">
                            {/* Resumo do Mentor */}
                            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border">
                                <h3 className="font-semibold mb-4">Resumo da Sessão</h3>

                                <div className="flex items-center space-x-3 mb-4">
                                    <div className="relative h-12 w-12">
                                        <Image
                                            src={mentor.image}
                                            alt={mentor.name}
                                            fill
                                            className="rounded-full object-cover"
                                        />
                                    </div>
                                    <div>
                                        <h4 className="font-medium">{mentor.name}</h4>
                                        <p className="text-sm text-gray-600">{mentor.title}</p>
                                    </div>
                                </div>

                                {bookingData.selectedDate && (
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Data:</span>
                                            <span>{new Date(bookingData.selectedDate).toLocaleDateString('pt-BR')}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Horário:</span>
                                            <span>{bookingData.selectedTime || 'Não selecionado'}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Duração:</span>
                                            <span>{bookingData.duration} min</span>
                                        </div>
                                    </div>
                                )}

                                <div className="border-t mt-4 pt-4">
                                    <div className="flex justify-between font-semibold">
                                        <span>Total:</span>
                                        <span className="text-secondary">MT {totalAmount.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Informações Importantes */}
                            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                                <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                                    Informações Importantes
                                </h4>
                                <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                                    <li>• Connecte minutos antes da sessão</li>
                                    <li>• Tenha suas perguntas preparadas</li>
                                    <li>• Conexão estável de internet</li>
                                    {/* <li>• Cancelamentos até 24h antes</li> */}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Container>
    );
}