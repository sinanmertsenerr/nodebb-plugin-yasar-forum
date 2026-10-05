<div data-widget-area="header">
	{{{ each widgets.header }}}
	{{widgets.header.html}}
	{{{ end }}}
</div>
<div class="yu-gate yu-gate--{yuGate.key}">
	<div class="yu-gate-card">
		<span class="yu-gate-ico" aria-hidden="true">{{yuGate.icon}}</span>
		<h1 class="yu-gate-title">{yuGate.title}</h1>
		<p class="yu-gate-text">{yuGate.text}</p>
		<p class="yu-gate-need">Bu aracı kullanmak için giriş yapman gerekiyor.</p>
		<div class="yu-gate-actions">
			<a class="btn btn-primary yu-gate-btn" href="{yuGate.loginUrl}">Giriş yap</a>
			{{{ if yuGate.allowRegistration }}}
			<a class="btn btn-outline-secondary yu-gate-btn" href="{yuGate.registerUrl}">Kayıt ol</a>
			{{{ end }}}
		</div>
	</div>
</div>
<div data-widget-area="footer">
	{{{ each widgets.footer }}}
	{{widgets.footer.html}}
	{{{ end }}}
</div>
