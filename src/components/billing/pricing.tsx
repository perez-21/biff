import React from 'react';
import { PricingCard } from './pricing-card';
import { Plan } from '@/types';
import { useToast } from '@/hooks/use-toast';

const plans: Plan[] = [
  {
    id: 'free',
    name: 'Free',
    description: 'Basic access to AI assistance',
    price: 0,
    features: [
      '10 prompts per day',
      'Access to GPT-4 model',
      'Chat history storage',
      'Basic priority support',
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    description: 'Full access for serious learners',
    price: 15,
    features: [
      'Unlimited prompts',
      'Access to all AI models',
      'Priority response times',
      'Advanced model customization',
      'Priority support',
    ],
    isPopular: true,
  },
];

export function Pricing() {
  const { toast } = useToast();

  const handleSelectPlan = (plan: Plan) => {
    if (plan.id === 'free') {
      toast({
        title: 'Already on free plan',
        description: 'You are already using the free plan',
      });
      return;
    }
    
    // Mock Stripe checkout
    // This would typically redirect to Stripe Checkout or display a payment modal
    toast({
      title: 'Redirecting to checkout',
      description: 'This would redirect to Stripe in a real application',
    });
    
    // Simulate successful payment after 2 seconds
    setTimeout(() => {
      toast({
        title: 'Subscription upgraded!',
        description: 'You now have unlimited access to Biff',
      });
    }, 2000);
  };

  return (
    <div className="py-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold">Choose Your Plan</h2>
        <p className="text-muted-foreground mt-2">
          Get unlimited access to AI assistance for your computer science studies
        </p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:gap-8 max-w-4xl mx-auto px-4">
        {plans.map((plan) => (
          <PricingCard 
            key={plan.id} 
            plan={plan} 
            onSelect={handleSelectPlan} 
          />
        ))}
      </div>
    </div>
  );
}