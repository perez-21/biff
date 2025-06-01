import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import { useAuth } from '@/lib/providers';
import { Plan } from '@/types';

interface PricingCardProps {
  plan: Plan;
  onSelect: (plan: Plan) => void;
}

export function PricingCard({ plan, onSelect }: PricingCardProps) {
  const { user } = useAuth();
  
  const isCurrentPlan = 
    (plan.id === 'free' && user && !user.isSubscribed) || 
    (plan.id === 'pro' && user && user.isSubscribed);

  return (
    <Card className={`w-full ${plan.isPopular ? 'border-primary' : ''}`}>
      {plan.isPopular && (
        <div className="absolute top-0 right-0">
          <div className="bg-primary text-primary-foreground text-xs font-medium px-3 py-1 rounded-bl-lg rounded-tr-lg">
            Popular
          </div>
        </div>
      )}
      
      <CardHeader>
        <CardTitle>{plan.name}</CardTitle>
        <CardDescription>{plan.description}</CardDescription>
        <div className="mt-4">
          <span className="text-3xl font-bold">${plan.price}</span>
          {plan.price > 0 && <span className="text-muted-foreground">/month</span>}
        </div>
      </CardHeader>
      
      <CardContent>
        <ul className="space-y-2">
          {plan.features.map((feature, i) => (
            <li key={i} className="flex items-center">
              <Check className="h-4 w-4 text-primary mr-2" />
              <span className="text-sm">{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      
      <CardFooter>
        <Button 
          className="w-full" 
          variant={plan.isPopular ? 'default' : 'outline'}
          disabled={isCurrentPlan}
          onClick={() => onSelect(plan)}
        >
          {isCurrentPlan ? 'Current Plan' : 'Select Plan'}
        </Button>
      </CardFooter>
    </Card>
  );
}