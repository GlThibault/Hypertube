import { trigger, state, style, transition, animate, keyframes } from '@angular/animations';

export const show = trigger('show', [
      state('hidden', style({ opacity: 0 })),
      state('revealed' , style({ opacity: 1 })),
      transition('* => *', animate('2s'))
    ])