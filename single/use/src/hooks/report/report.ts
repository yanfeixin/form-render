import { reportApi } from "../../api";

type InfoInter = {
  token: string;
  custom?: { [key: string]: any };
  terminal: string;
  terminalInfo: string;
  platform: string;
};

class ErrorReporter {
  private info: InfoInter;

  private userAgent: string;

  constructor(info: InfoInter) {
    this.info = info;
    this.userAgent = navigator.userAgent;
  }

  errorReportEvent() {
    window.onerror = this.handleGlobalError.bind(this);
  }

  rejectionReportEvent() {
    window.onunhandledrejection = this.handleUnhandledRejection.bind(this);
  }

  handleGlobalError(
    message: Event | string,
    source: any,
    lineno: any,
    colno: any,
    error: any
  ) {
    const errorData = {
      message,
      source,
      lineno,
      colno,
      stack: error ? error.stack : ''
    };
    this.reportError(errorData, 'error');
  }

  handleUnhandledRejection(event: PromiseRejectionEvent) {
    const errorData = {
      reason: event.reason
    };
    this.reportError(errorData, 'reject');
  }

  async reportError(errorData: any, type: string) {
    const data = {
      ...this.info,
      terminalInfo: this.userAgent,
      level: 'error',
      message: '',
      traceId: '',
      type: '',
      apiUrl: '',
      remark: JSON.stringify(this.info.custom)
    };
    if (type === 'reject') {
      data.message = JSON.stringify(errorData);
      data.traceId = errorData.traceId;
      data.apiUrl = errorData.url;
      data.type = 'unhandledrejection';
    }
    if (type === 'error') {
      data.message = errorData.stack || errorData.message;
      data.type = errorData.message ? errorData.message.split(':')[0] : '';
    }
    try {
      await reportApi.errorReport(data)
    } catch (error) {
      console.error('ErrorReporter report error:', error)
    }
  }
}

export default ErrorReporter;
