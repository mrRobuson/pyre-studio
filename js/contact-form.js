(function () {
  var form = document.getElementById('contact-form');
  if (!form) return;

  var statusEl = document.getElementById('contact-form-status');
  var submitBtn = form.querySelector('[type="submit"]');
  var defaultLabel = submitBtn ? submitBtn.textContent.trim() : 'Enviar Mensagem';

  form.addEventListener('submit', function (event) {
    event.preventDefault();

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'A enviar…';
    }

    setStatus('', '');

    var payload = {
      name: form.name.value.trim(),
      email: form.email.value.trim(),
      project_type: form.project_type.value,
      budget: form.budget.value || 'Não indicado',
      deadline: form.deadline.value || 'Não indicado',
      message: form.message.value.trim(),
      _subject: 'Novo contacto — Pyre Studio',
      _template: 'table',
      _captcha: 'false'
    };

    fetch('https://formsubmit.co/ajax/geral@pyre.studio', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify(payload)
    })
      .then(function (response) {
        return response.json().then(function (data) {
          if (!response.ok) {
            throw new Error(data.message || 'Não foi possível enviar a mensagem.');
          }
          return data;
        });
      })
      .then(function () {
        form.reset();
        setStatus(
          'success',
          'Mensagem enviada com sucesso. Respondemos em até 24 horas.'
        );
      })
      .catch(function (error) {
        setStatus(
          'error',
          error.message || 'Erro ao enviar. Tente novamente ou escreva para geral@pyre.studio.'
        );
      })
      .finally(function () {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = defaultLabel;
        }
      });
  });

  function setStatus(type, message) {
    if (!statusEl) return;

    statusEl.hidden = !message;
    statusEl.classList.remove('form__status--success', 'form__status--error');

    if (type === 'success') {
      statusEl.classList.add('form__status--success');
    } else if (type === 'error') {
      statusEl.classList.add('form__status--error');
    }

    statusEl.textContent = message;
  }
})();
