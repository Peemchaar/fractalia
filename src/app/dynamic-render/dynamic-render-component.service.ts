import { ComponentFactoryResolver, Injectable } from '@angular/core';

@Injectable()
export class DynamicRenderComponentService {
  constructor(private componentFactoryResolver: ComponentFactoryResolver) {}

  loadComponent(container: any, component: any, data?: any) {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(component);
    const viewContainerRef = container.viewContainerRef;
    viewContainerRef.clear();
    const componentRef = viewContainerRef.createComponent(componentFactory);
    (componentRef.instance as any).data = data;
  }
}
