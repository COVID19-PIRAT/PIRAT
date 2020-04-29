import { Pipe, PipeTransform } from '@angular/core';
import { LocaleService } from './locale.service';
import { ConfigurationService } from './configuration.service';


@Pipe({
  name: 'translate'
})
export class TranslatePipe implements PipeTransform {

  itemLabels: {
    en: Map<string, string>,
    currentLanguage: Map<string, string>;
  };


  constructor(
    private localeService: LocaleService,
    private configurationService: ConfigurationService,
  ) {
    this.itemLabels = localeService.itemLabels;
  }


  transform(transUnitId: string): string {
    return this.itemLabels.currentLanguage.get(transUnitId)
      ?? this.itemLabels.en.get(transUnitId)
      ?? (this.configurationService.env.production ? '' : 'Error: translation ID not found!' );
  }

}
