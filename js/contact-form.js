(function () {
  var FORM_ENDPOINT = 'https://formsubmit.co/ajax/hackerx22333@gmail.com';

  var PROJECT_TYPES = {
    web: 'Aplicação Web de Alta Performance',
    system: 'Sistema de Gestão Complexo',
    ecommerce: 'E-Commerce Robusto',
    other: 'Outro Desafio Técnico'
  };

  var PLANS = {
    faisca: 'Plano Faísca — a partir de 150.000 AOA',
    chama: 'Plano Chama — a partir de 350.000 AOA',
    forja: 'Plano Forja — a partir de 700.000 AOA',
    undecided: 'Ainda não sei — preciso de orientação'
  };

  var DEADLINES = {
    urgent: 'Urgente (< 2 semanas)',
    '1month': '1 Mês',
    flexible: 'Sem pressa'
  };

  var form = document.getElementById('contact-form');
  if (!form) return;

  var statusEl = document.getElementById('contact-form-status');
  var submitBtn = form.querySelector('[type="submit"]');
  var defaultLabel = submitBtn ? submitBtn.textContent.trim() : 'Enviar Mensagem';

  form.addEventListener('submit', function (event) {
    event.preventDefault();

    if (window.location.protocol === 'file:') {
      setStatus(
        'error',
        'Abre o site através de um servidor local (Live Server) ou do link da Vercel — o formulário não funciona em ficheiros HTML abertos directamente.'
      );
      return;
    }

    if (form._honey && form._honey.value) {
      return;
    }

    var validationError = validateForm(form);
    if (validationError) {
      setStatus('error', validationError);
      return;
    }

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'A enviar…';
    }

    setStatus('', '');

    fetch(FORM_ENDPOINT, {
      method: 'POST',
      headers: {
        Accept: 'application/json'
      },
      body: buildSubmissionData(form)
    })
      .then(function (response) {
        return response.json().then(function (data) {
          if (!response.ok || data.success === 'false' || data.success === false) {
            throw new Error(
              data.message ||
                'Não foi possível enviar a mensagem. Confirma que abriste o site num servidor (não como ficheiro local).'
            );
          }
          return data;
        });
      })
      .then(function (data) {
        form.reset();
        var message = 'Mensagem enviada com sucesso. Respondemos em até 24 horas.';

        if (/activate|confirm|verification/i.test(data.message || '')) {
          message =
            'Quase pronto: enviámos um email de activação para a tua caixa de entrada. Abre o link do FormSubmit (verifica o spam) e volta a testar o formulário.';
        }

        setStatus('success', message);
      })
      .catch(function (error) {
        setStatus(
          'error',
          error.message ||
            'Erro ao enviar. Tenta outra vez ou escreve directamente para o email indicado na página.'
        );
      })
      .finally(function () {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = defaultLabel;
        }
      });
  });

  function buildSubmissionData(formEl) {
    var senderName = formEl.name.value.trim();
    var senderEmail = formEl.email.value.trim();
    var projectType = labelForSelect(formEl.project_type, PROJECT_TYPES);
    var plan = labelForSelect(formEl.plan, PLANS, 'Não indicado');
    var deadline = labelForSelect(formEl.deadline, DEADLINES, 'Não indicado');
    var formData = new FormData();

    formData.append('_subject', '[Pyre Studio] ' + senderName + ' — ' + projectType);
    formData.append('_replyto', senderEmail);
    formData.append('_template', 'table');
    formData.append('_captcha', 'false');
    formData.append('_url', window.location.href);
    formData.append('Nome', senderName);
    formData.append('Email', senderEmail);
    formData.append('Tipo de Projeto', projectType);
    formData.append('Plano Pyre', plan);
    formData.append('Prazo', deadline);
    formData.append('Mensagem', formEl.message.value.trim());

    return formData;
  }

  function labelForSelect(selectEl, labelsMap, fallback) {
    var value = selectEl.value;
    if (!value) {
      return fallback || '';
    }

    return labelsMap[value] || selectEl.options[selectEl.selectedIndex].textContent.trim();
  }

  function validateForm(formEl) {
    if (!formEl.name.value.trim()) {
      return 'Indica o teu nome.';
    }

    if (!formEl.email.value.trim()) {
      return 'Indica o teu email.';
    }

    if (!formEl.project_type.value) {
      return 'Selecciona o tipo de projeto.';
    }

    if (!formEl.message.value.trim()) {
      return 'Escreve uma mensagem.';
    }

    return '';
  }

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
