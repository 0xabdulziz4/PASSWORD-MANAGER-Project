const passwordInput = document.getElementById('password');
const strengthIndicator = document.getElementById('strengthIndicator');
const strengthText = document.getElementById('strengthText');

const lengthRule = document.getElementById('lengthRule');
const uppercaseRule = document.getElementById('uppercaseRule');
const lowercaseRule = document.getElementById('lowercaseRule');
const numberRule = document.getElementById('numberRule');
const specialCharRule = document.getElementById('specialCharRule');

passwordInput.addEventListener('input', () => {
    const password = passwordInput.value;
    const strength = calculateStrength(password);
    updateStrengthIndicator(strength);
    updateRules(password);
});

function calculateStrength(password) {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[@$!%*?&#]/.test(password)) strength++;
    return strength;
}

function updateStrengthIndicator(strength) {
    strengthIndicator.classList.remove("weak", "medium", "strong");
    if (strength === 5) {
        strengthIndicator.classList.add("strong");
        strengthText.textContent = 'Strength: Strong';
    } else if (strength >= 3) {
        strengthIndicator.classList.add("medium");
        strengthText.textContent = 'Strength: Medium';
    } else {
        strengthIndicator.classList.add("weak");
        strengthText.textContent = 'Strength: Weak';
    }
}

function updateRules(password) {
    lengthRule.style.color = password.length >= 8 ? '#4caf50' : '#f44336';
    uppercaseRule.style.color = /[A-Z]/.test(password) ? '#4caf50' : '#f44336';
    lowercaseRule.style.color = /[a-z]/.test(password) ? '#4caf50' : '#f44336';
    numberRule.style.color = /[0-9]/.test(password) ? '#4caf50' : '#f44336';
    specialCharRule.style.color = /[@$!%*?&#]/.test(password) ? '#4caf50' : '#f44336';
}
