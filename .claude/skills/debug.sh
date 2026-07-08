#!/bin/bash

# Debug utility script for quick diagnostics
# Usage: ./debug.sh [option]
# Options: env, deps, types, test, logs, all

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Helper functions
print_header() {
    echo -e "\n${BLUE}═══════════════════════════════════════${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}═══════════════════════════════════════${NC}\n"
}

print_success() {
    echo -e "${GREEN}✓${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

# Check environment
check_env() {
    print_header "Environment Check"

    echo "Node.js version:"
    node --version || print_error "Node.js not found"

    echo -e "\nnpm version:"
    npm --version || print_error "npm not found"

    echo -e "\nProject directory:"
    pwd

    echo -e "\nPackage.json exists:"
    if [ -f "package.json" ]; then
        print_success "Found package.json"
        echo "Project: $(jq -r '.name' package.json 2>/dev/null || echo 'N/A')"
        echo "Version: $(jq -r '.version' package.json 2>/dev/null || echo 'N/A')"
    else
        print_error "package.json not found"
    fi

    echo -e "\nEnvironment files:"
    for file in .env .env.local .env.development .env.production; do
        if [ -f "$file" ]; then
            print_success "$file exists"
        fi
    done
}

# Check dependencies
check_deps() {
    print_header "Dependencies Check"

    if [ ! -d "node_modules" ]; then
        print_error "node_modules not found - run 'npm install'"
        return 1
    else
        print_success "node_modules exists"
    fi

    echo -e "\nOutdated packages:"
    npm outdated || print_success "All packages up to date"

    echo -e "\nVulnerabilities:"
    npm audit --audit-level=moderate 2>/dev/null | tail -10
}

# Check TypeScript
check_types() {
    print_header "TypeScript Check"

    if [ -f "tsconfig.json" ]; then
        print_success "TypeScript project detected"
        echo -e "\nRunning type check..."
        npx tsc --noEmit 2>&1 | head -30
    else
        print_warning "Not a TypeScript project"
    fi
}

# Run tests
run_tests() {
    print_header "Running Tests"

    if npm test -- --version 2>/dev/null; then
        echo "Running tests..."
        npm test 2>&1 | head -50
    else
        print_warning "No test command found"
    fi
}

# Check logs
check_logs() {
    print_header "Recent Logs"

    # Check for common log files
    for log in *.log logs/*.log .next/*.log; do
        if [ -f "$log" ]; then
            echo -e "\n${YELLOW}=== $log ===${NC}"
            tail -20 "$log"
        fi
    done

    # Check for error logs in console
    if command -v npm &> /dev/null; then
        echo -e "\n${YELLOW}=== npm debug log ===${NC}"
        if [ -f "npm-debug.log" ]; then
            tail -20 npm-debug.log
        else
            print_success "No npm errors"
        fi
    fi
}

# Check running processes
check_processes() {
    print_header "Running Processes"

    echo "Node processes:"
    ps aux | grep node | grep -v grep || print_warning "No Node processes running"

    echo -e "\nPorts in use:"
    lsof -i -P | grep LISTEN | grep -E ':(3000|3001|5173|8080|4173)' || print_warning "No dev servers detected"
}

# Quick fix suggestions
suggest_fixes() {
    print_header "Quick Fix Suggestions"

    echo "Common fixes to try:"
    echo ""
    echo "1. Reinstall dependencies:"
    echo "   ${GREEN}rm -rf node_modules package-lock.json && npm install${NC}"
    echo ""
    echo "2. Clear build cache:"
    echo "   ${GREEN}rm -rf dist .next out build${NC}"
    echo ""
    echo "3. Clear npm cache:"
    echo "   ${GREEN}npm cache clean --force${NC}"
    echo ""
    echo "4. Kill process on port 3000:"
    echo "   ${GREEN}kill -9 \$(lsof -t -i:3000)${NC}"
    echo ""
    echo "5. Check environment variables:"
    echo "   ${GREEN}cat .env${NC}"
    echo ""
    echo "6. Run with verbose logging:"
    echo "   ${GREEN}DEBUG=* npm run dev${NC}"
}

# Network diagnostics
check_network() {
    print_header "Network Diagnostics"

    echo "Testing localhost connections:"
    for port in 3000 5173 8080; do
        if curl -s http://localhost:$port > /dev/null 2>&1; then
            print_success "Port $port is responding"
        fi
    done

    echo -e "\nDNS check:"
    if ping -c 1 google.com > /dev/null 2>&1; then
        print_success "Internet connection OK"
    else
        print_error "No internet connection"
    fi
}

# Main function
main() {
    echo -e "${BLUE}"
    echo "╔══════════════════════════════════════╗"
    echo "║      🔍 Debug Diagnostic Tool        ║"
    echo "╚══════════════════════════════════════╝"
    echo -e "${NC}"

    case "${1:-all}" in
        env)
            check_env
            ;;
        deps)
            check_deps
            ;;
        types)
            check_types
            ;;
        test)
            run_tests
            ;;
        logs)
            check_logs
            ;;
        proc|processes)
            check_processes
            ;;
        net|network)
            check_network
            ;;
        fix|fixes)
            suggest_fixes
            ;;
        all)
            check_env
            check_deps
            check_processes
            check_types
            suggest_fixes
            ;;
        *)
            echo "Usage: $0 [env|deps|types|test|logs|processes|network|fixes|all]"
            echo ""
            echo "Options:"
            echo "  env        - Check Node.js, npm, and project environment"
            echo "  deps       - Check dependencies and vulnerabilities"
            echo "  types      - Run TypeScript type checking"
            echo "  test       - Run test suite"
            echo "  logs       - Show recent log files"
            echo "  processes  - Show running Node processes and ports"
            echo "  network    - Test network connectivity"
            echo "  fixes      - Show common fix suggestions"
            echo "  all        - Run all checks (default)"
            exit 1
            ;;
    esac

    echo -e "\n${GREEN}═══════════════════════════════════════${NC}"
    echo -e "${GREEN}Debug diagnostics complete!${NC}"
    echo -e "${GREEN}═══════════════════════════════════════${NC}\n"
}

# Run main function
main "$@"
