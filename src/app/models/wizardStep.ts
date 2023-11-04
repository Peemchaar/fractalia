export class WizardStep {
    order: number = 0;
    serviceName: string = "";
    serviceCode: string = "";
    serviceId: number = 0;
    finalized: boolean = false;
    currentStep: number = 0;
    totalSteps: number = 0;  
}