
document.addEventListener('DOMContentLoaded', function() {
    const generateBtn = document.getElementById('generate');
    const copyBtn = document.getElementById('copy');
    const passwordField = document.getElementById('password');
    const lengthInput = document.getElementById('length');
    const uppercaseCheck = document.getElementById('uppercase');
    const lowercaseCheck = document.getElementById('lowercase');
    const numbersCheck = document.getElementById('numbers');
    const symbolsCheck = document.getElementById('symbols');
    const meterLevel = document.getElementById('meter-level');
    const strengthText = document.getElementById('strength-text');
    const entropyBits = document.getElementById('entropy-bits');
    const combinations = document.getElementById('combinations');
    const breakTime = document.getElementById('break-time');

    // Gerar senha ao carregar a página
    generatePassword();
    
    // Event listeners
    generateBtn.addEventListener('click', generatePassword);
    copyBtn.addEventListener('click', copyPassword);
    
    // Gerador de senha
    function generatePassword() {
        const length = parseInt(lengthInput.value);
        const hasUpper = uppercaseCheck.checked;
        const hasLower = lowercaseCheck.checked;
        const hasNumber = numbersCheck.checked;
        const hasSymbol = symbolsCheck.checked;
        
        if (length < 8 || length > 64) {
            alert('O comprimento deve ser entre 8 e 64 caracteres');
            return;
        }
        
        if (!hasUpper && !hasLower && !hasNumber && !hasSymbol) {
            alert('Selecione pelo menos um tipo de caractere');
            return;
        }
        
        let charset = '';
        if (hasLower) charset += 'abcdefghijklmnopqrstuvwxyz';
        if (hasUpper) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        if (hasNumber) charset += '0123456789';
        if (hasSymbol) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';
        
        const array = new Uint32Array(length);
        window.crypto.getRandomValues(array);
        
        let password = '';
        for (let i = 0; i < length; i++) {
            password += charset[array[i] % charset.length];
        }
        
        passwordField.value = password;
        analyzePassword(password, charset.length);
    }
    
    // Analisar força da senha
    function analyzePassword(password, charsetSize) {
        // Calcular entropia
        const entropy = Math.log2(Math.pow(charsetSize, password.length));
        entropyBits.textContent = entropy.toFixed(2);
        
        // Calcular combinações
        const comb = Math.pow(charsetSize, password.length);
        combinations.textContent = comb.toExponential(2);
        
        // Tempo para quebrar (1 bilhão de tentativas/segundo)
        const seconds = comb / 1e9;
        breakTime.textContent = formatTime(seconds);
        
        // Atualizar medidor visual
        updateStrengthMeter(entropy);
    }
    
    // Atualizar medidor de força
    function updateStrengthMeter(entropy) {
        let strength = 0;
        let color = '';
        let text = '';
        
        if (entropy < 40) {
            strength = entropy / 40 * 33;
            color = 'var(--danger)';
            text = 'Fraca';
        } else if (entropy < 80) {
            strength = 33 + (entropy - 40) / 40 * 33;
            color = 'var(--warning)';
            text = 'Média';
        } else {
            strength = 66 + (entropy - 80) / 120 * 34;
            color = 'var(--success)';
            text = 'Forte';
        }
        
        strength = Math.min(100, Math.max(0, strength));
        meterLevel.style.width = strength + '%';
        meterLevel.style.backgroundColor = color;
        strengthText.textContent = text;
        strengthText.style.color = color;
    }
    
    // Formatar tempo
    function formatTime(seconds) {
        if (seconds < 1) return "menos de 1 segundo";
        if (seconds < 60) return Math.floor(seconds) + " segundos";
        
        const minutes = seconds / 60;
        if (minutes < 60) return Math.floor(minutes) + " minutos";
        
        const hours = minutes / 60;
        if (hours < 24) return Math.floor(hours) + " horas";
        
        const days = hours / 24;
        if (days < 365) return Math.floor(days) + " dias";
        
        const years = days / 365;
        if (years < 1000) return Math.floor(years) + " anos";
        
        return Math.floor(years / 1000) + " milênios";
    }
    
    // Copiar senha
    function copyPassword() {
        if (!passwordField.value) return;
        
        passwordField.select();
        document.execCommand('copy');
        
        // Feedback visual
        const originalText = copyBtn.textContent;
        copyBtn.textContent = 'Copiado!';
        copyBtn.style.backgroundColor = 'var(--success)';
        
        setTimeout(() => {
            copyBtn.textContent = originalText;
            copyBtn.style.backgroundColor = 'var(--accent)';
        }, 2000);
    }
});
