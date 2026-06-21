document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('registrationForm');
  const submitBtn = document.getElementById('registrazion_button');
  const passwordInput = document.getElementById('password');
  const birthDateInput = document.getElementById('birthDate');
  const requiredFields = form.querySelectorAll('[required]');
  const meterSections = document.querySelectorAll('.meter-section');
  const toggleIcon = document.querySelector('.password-toggle i');

  if (!form || !submitBtn || !passwordInput || !birthDateInput) return;

  /* ---------- HELPERS ---------- */
  function isFieldFilled(field) {
    if (field.type === 'checkbox' || field.type === 'radio') return field.checked;
    if (field.tagName === 'SELECT') return field.value !== '';
    return field.value.trim() !== '';
  }

  function getPasswordStrength(password) {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    if (strength > 4) strength = 4;
    return strength;
  }

  function isValidPassword(password) {
    return getPasswordStrength(password) >= 4;
  }

  // Birthdate validation (must be at least 18 years old)
  const today = new Date();
  const minYear = today.getFullYear() -18 -5; // Allowing a 5 year margin for users who are exactly 18
  birthDateInput.max = new Date(minYear, today.getMonth(), today.getDate()).toISOString().split("T")[0];

  function isBirthDateValid() {
    const value = birthDateInput.value;
    if (!value) return false;
    const date = new Date(value);
    if (isNaN(date)) return false;
    const maxDate = new Date(minYear, today.getMonth(), today.getDate());
    return date <= maxDate;
  }

  /* ---------- VALIDATION ---------- */
  function validatePassword(showFeedback = false) {
    const valid = isValidPassword(passwordInput.value.trim());
    if (showFeedback) passwordInput.classList.toggle('is-invalid', !valid);
    else passwordInput.classList.remove('is-invalid');
    return valid;
  }

  function validateRequiredFields(showFeedback = false) {
    let allValid = true;
    requiredFields.forEach(field => {
      const filled = isFieldFilled(field);
      if (showFeedback) field.classList.toggle('is-invalid', !filled);
      else field.classList.remove('is-invalid');
      if (!filled) allValid = false;
    });
    return allValid;
  }

  function validateBirthDate(showFeedback = false) {
    const valid = isBirthDateValid();
    if (showFeedback) birthDateInput.classList.toggle('is-invalid', !valid);
    else birthDateInput.classList.remove('is-invalid');
    return valid;
  }
  
  function validateForm(showFeedback = false) {
    const requiredValid = validateRequiredFields(showFeedback);
    const passwordValid = validatePassword(showFeedback);
    const birthDateValid = validateBirthDate(showFeedback);
    const formValid = requiredValid && passwordValid && birthDateValid;
    //submitBtn.disabled = !formValid;
    return formValid;
  }

  /* ---------- EVENTS ---------- */
  // Password strength meter + validation
  passwordInput.addEventListener('input', () => {
    const password = passwordInput.value.trim();

    // Reset meter
    meterSections.forEach(section => section.className = 'meter-section flex-fill rounded');

    // Determine strength
    const strength = getPasswordStrength(password);
    for (let i = 0; i < strength; i++) {
      if (strength === 1) meterSections[i].classList.add('weak');
      else if (strength === 2) meterSections[i].classList.add('medium');
      else if (strength === 3) meterSections[i].classList.add('strong');
      else if (strength >= 4) meterSections[i].classList.add('very-strong');
    }

    validateForm(false);
  });

  // Show/hide password toggle
  if (toggleIcon) {
    toggleIcon.addEventListener('click', () => {
      const isHidden = passwordInput.type === 'password';
      passwordInput.type = isHidden ? 'text' : 'password';
      toggleIcon.classList.toggle('fa-eye');
      toggleIcon.classList.toggle('fa-eye-slash');
    });
  }

  // Live validation for required fields and birthdate
  requiredFields.forEach(field => {
    field.addEventListener('input', () => validateForm(false));
    field.addEventListener('change', () => validateForm(false));
  });
  birthDateInput.addEventListener('input', () => validateForm(false));

  // Submit
  form.addEventListener('submit', event => {
    if (!validateForm(true)) {
      event.preventDefault();
      const firstInvalid = form.querySelector('.is-invalid');
      if (firstInvalid) firstInvalid.focus();
    }
  });

  // Initial validation
  validateForm(false);
});