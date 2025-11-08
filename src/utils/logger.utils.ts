// ============================================================================
// File: src/utils/logger.utils.ts
// ============================================================================

export class Logger {
    private static colors = {
      reset: '\x1b[0m',
      green: '\x1b[32m',
      red: '\x1b[31m',
      yellow: '\x1b[33m',
      blue: '\x1b[34m',
      cyan: '\x1b[36m'
    };
  
    static info(message: string): void {
      console.log(`${this.colors.cyan}ℹ${this.colors.reset} ${message}`);
    }
  
    static success(message: string): void {
      console.log(`${this.colors.green}✓${this.colors.reset} ${message}`);
    }
  
    static error(message: string): void {
      console.log(`${this.colors.red}✗${this.colors.reset} ${message}`);
    }
  
    static warning(message: string): void {
      console.log(`${this.colors.yellow}⚠${this.colors.reset} ${message}`);
    }
  
    static section(title: string): void {
      console.log('\n' + '='.repeat(70));
      console.log(title);
      console.log('='.repeat(70));
    }
  
    static newBaseline(name: string): void {
      console.log(`${this.colors.blue}📸 NEW${this.colors.reset} ${name}`);
    }
  }