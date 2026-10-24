/**
 * Modern TypeScript client for Didar CRM (دیدار)
 * Built with native fetch - zero external dependencies.
 */

export interface DidarConfig {
  apiKey: string;
  baseUrl?: string; // defaults to https://app.didar.me
}

export interface DidarResponse<T = any> {
  Response: T | null;
  Error: string | null;
}

export class DidarClient {
  private readonly apiKey: string;
  private readonly baseUrl: string;

  constructor(config: DidarConfig) {
    this.apiKey = config.apiKey;
    this.baseUrl = (config.baseUrl || 'https://app.didar.me').replace(/\/+$/, '');
  }

  private async request<T = any>(
    path: string,
    options: {
      method?: 'GET' | 'POST';
      body?: Record<string, any>;
      query?: Record<string, string>;
    } = {}
  ): Promise<T> {
    const url = new URL(`${this.baseUrl}/api/${path.replace(/^\/+/, '')}`);
    url.searchParams.set('apikey', this.apiKey);

    if (options.query) {
      for (const [k, v] of Object.entries(options.query)) {
        if (v !== undefined && v !== null) {
          url.searchParams.set(k, v);
        }
      }
    }

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };

    const res = await fetch(url.toString(), {
      method: options.method || 'POST',
      headers,
      body: options.body && options.method !== 'GET' ? JSON.stringify(options.body) : undefined,
    });

    if (!res.ok) {
      throw new Error(`Didar API HTTP error: ${res.status} ${res.statusText}`);
    }

    const payload = (await res.json()) as DidarResponse<T>;

    if (payload.Error) {
      throw new Error(`Didar CRM Error: ${payload.Error}`);
    }

    return (payload.Response ?? payload) as T;
  }

  // --- Contacts ---
  async saveContact(contact: Record<string, any>, segmentIds: string[] = []) {
    return this.request('contact/save', {
      body: { Contact: contact, SegmentIds: segmentIds },
    });
  }

  async getContactByPhone(mobilePhone: string) {
    return this.request<any[]>('contact/getbyphonenumber', {
      body: { MobilePhone: mobilePhone },
    });
  }

  async searchPersons(criteria: Record<string, any> = {}, from = 0, limit = 20) {
    return this.request('contact/PersonSearch', {
      body: { Criteria: criteria, From: from, Limit: limit },
    });
  }

  // --- Deals ---
  async getPipelines(type: 0 | 1 = 0) {
    return this.request<any[]>(`pipeline/list/${type}`, {
      body: {},
    });
  }

  async saveDeal(deal: Record<string, any>, dealItems: any[] = []) {
    return this.request('deal/save_v2', {
      body: { Deal: deal, DealItems: dealItems },
    });
  }

  async searchDeals(criteria: Record<string, any> = {}, from = 0, limit = 20) {
    return this.request('deal/search_v2', {
      body: { Criteria: criteria, From: from, Limit: limit },
    });
  }

  // --- Products ---
  async saveProduct(product: Record<string, any>) {
    return this.request('product/save', {
      body: { Product: product },
    });
  }

  async getProductsByCodes(codes: string[]) {
    return this.request<{ Total: number; Products: any[] }>('product/getproductbycodes', {
      body: { Code: codes },
    });
  }

  // --- Activities & Notes ---
  async saveActivity(activity: Record<string, any>) {
    return this.request('activity/save', {
      body: { Activity: activity },
    });
  }

  async saveNote(args: {
    resultNote: string;
    ownerId: string;
    contactIds?: string[];
    dealId?: string;
    caseId?: string;
  }) {
    const zeroGuid = '00000000-0000-0000-0000-000000000000';
    const nowIso = new Date().toISOString();
    return this.saveActivity({
      ActivityTypeId: zeroGuid,
      OwnerId: args.ownerId,
      ResultNote: args.resultNote,
      IsDone: true,
      IsDeleted: false,
      DueDate: nowIso,
      DoneDate: nowIso,
      DueDateType: 'NoTime',
      DoneDateType: 'NoTime',
      ContactIds: args.contactIds || [],
      DealId: args.dealId || zeroGuid,
      CaseId: args.caseId || zeroGuid,
    });
  }

  // --- Telephony / VoIP ---
  async popupCallerId(callerNumber: string, agentExtension: string) {
    return this.request('calllog/insert', {
      method: 'GET',
      query: {
        number: callerNumber,
        internalnumber: agentExtension,
      },
    });
  }
}
