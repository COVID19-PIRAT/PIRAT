import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { LocaleService } from './locale.service';
import { AddressFormat, addressFormatFromApi } from './_types/AddressFormat';


@Injectable({
  providedIn: 'root'
})
export class ConfigurationService {

  private readonly ENVIRONMENTS = {
    development: {
      production: false,
      environment: 'development',
      reCaptchaSiteKey: '6LfM2-4UAAAAAOfLy7MgifLs1nCi6Ub5cFqWOcky',
    },
    testproduction: {
      production: false,
      environment: 'testproduction',
      reCaptchaSiteKey: '6LfM2-4UAAAAAOfLy7MgifLs1nCi6Ub5cFqWOcky',
    },
    production: {
      production: true,
      environment: 'production',
      reCaptchaSiteKey: '6LegBOgUAAAAAIqr5lojeb-H-znxM6zLFbFcGfyc',
    }
  };

  env: {
    production: boolean,
    environment: string,
    reCaptchaSiteKey: string,
  };

  countryName: string;

  addressFormat: AddressFormat;

  languageConstants = {
    device: new Map<string, string>(),      // value -> language string
    consumable: new Map<string, string>(),  // value -> language string
    personnelArea: new Map<string, string>(),           // value -> language string
    personnelQualification: new Map<string, string>(),  // value -> language string
  };

  gitCommits: {
    frontend: string,
    backend: string,
  } = {
    frontend: undefined,
    backend: undefined,
  };


  constructor(
    private apiService: ApiService,
    private localeService: LocaleService,
  ) {
  }


  async startup() {
    // TODO Parallelize requests as far as possible
    // Init LocaleService
    await this.localeService.init();

    // Fetch environment
    const response1 = await this.apiService.getEnvironment();
    if (response1.error) {
      throw new Error('Application cannot start because the environment name cannot be fetched.');
    }
    this.env = this.ENVIRONMENTS[response1.data];
    if (!this.env) {
      throw new Error('Application cannot start because the environment is unknown: ' + response1.data);
    }

    // Fetch configurations
    const response2 = await this.apiService.getRegionConfiguration(this.localeService.region);
    if (response2.error) {
      throw new Error('Application cannot start because the region configuration cannot be fetched.');
    }
    this.countryName = response2.data.countryName;
    this.addressFormat = addressFormatFromApi(response2.data.addressFormat, this.localeService.language);
    await this.prepareCategories(response2.data);

    // Fetch Git commit hash of the frontend
    const response3 = await fetch('/assets/content/git_commit');
    const gitCommitFrontend = await response3.text();
    if (gitCommitFrontend[0] !== '#') {
      this.gitCommits.frontend = gitCommitFrontend;
    }

    // Fetch Git commit hash of the backend
    const response4 = await this.apiService.getBackendVersion();
    if (response4.status !== 204) {
      this.gitCommits.backend = response4.data;
    }
  }


  private async prepareCategories(data) {
    // Get available categories
    const availableCategories = new Map<string, Array<string>>(); // Category type -> categories
                                                                  // Example: "device" -> ["PCR_THERMOCYCLER", ...]
    for (const categoryType in data.categories) {
      if (!data.categories.hasOwnProperty(categoryType)) {
        continue;
      }
      availableCategories.set(categoryType, data.categories[categoryType]);
    }

    // Get language strings of the categories
    let languageData = data.languages[this.localeService.language];
    if (!languageData) {
      languageData = data.languages.en; // Let English be the default language.
    }
    availableCategories.forEach((categories, categoryType) => {
      const constantsMap: Map<string, string> = this.languageConstants[categoryType];
      for (const category of categories) {
        constantsMap.set(category, languageData[categoryType][category]);
      }
    });
  }
}
