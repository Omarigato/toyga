import { useState } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { userOtpRequest, userOtpVerify, userLogin, userRegister } from '@/lib/apiClient';

export default function UserAuthPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || '/app/events';

  // Tabs: 'otp' | 'password'
  const [authMethod, setAuthMethod] = useState<'otp' | 'password'>('otp');
  // Password Mode: 'login' | 'register'
  const [passwordMode, setPasswordMode] = useState<'login' | 'register'>('login');

  // Fields
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [otpStep, setOtpStep] = useState<1 | 2>(1); // 1 = input phone, 2 = input code

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [registerName, setRegisterName] = useState('');

  // States
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const cleanStatus = () => {
    setError('');
    setSuccess('');
  };

  // OTP Code Request
  const handleOtpRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    cleanStatus();
    setLoading(true);

    try {
      // Validate phone number
      if (!phone.match(/^\+?[78]\d{10}$/)) {
        throw new Error(t('auth.invalid_phone', 'Нұсқаулық: телефон +77001234567 форматында болу керек.'));
      }
      await userOtpRequest(phone, 'login');
      setSuccess(t('auth.otp_sent', 'Растау коды WhatsApp арқылы жіберілді.'));
      setOtpStep(2);
    } catch (err: any) {
      setError(err.message || t('common.error'));
    } finally {
      setLoading(false);
    }
  };

  // OTP Code Verification
  const handleOtpVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    cleanStatus();
    setLoading(true);

    try {
      const res = await userOtpVerify(phone, code, name || undefined);
      if (res.success) {
        navigate(redirect);
      }
    } catch (err: any) {
      setError(err.message || t('auth.invalid_code', 'Қате растау коды.'));
    } finally {
      setLoading(false);
    }
  };

  // Email Login
  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    cleanStatus();
    setLoading(true);

    try {
      const res = await userLogin({ email, password });
      if (res.success) {
        navigate(redirect);
      }
    } catch (err: any) {
      setError(err.message || t('auth.login_failed', 'Енгізілген email немесе құпия сөз қате.'));
    } finally {
      setLoading(false);
    }
  };

  // Email Registration
  const handleEmailRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    cleanStatus();
    setLoading(true);

    try {
      const res = await userRegister({ name: registerName, email, password });
      if (res.success) {
        navigate(redirect);
      }
    } catch (err: any) {
      setError(err.message || t('auth.register_failed', 'Тіркелу қатесі.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background-100 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Brand Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex flex-col items-center gap-2">
            <div className="w-14 h-14 rounded-2xl bg-accent-50 flex items-center justify-center shadow-lg border border-accent-100 overflow-hidden p-1">
              <img src="/logo.png" alt="Toyga logo" className="w-full h-full object-contain" />
            </div>
            <span className="text-2xl font-bold text-accent-700 font-heading">Toyga.kz</span>
          </Link>
          <p className="text-sm text-foreground-500 mt-2">
            {t('home.hero.subtitle', 'Заманауи онлайн той шақырулары')}
          </p>
        </div>

        {/* Card Container */}
        <div className="bg-background-50 rounded-2xl border border-background-200 p-8 shadow-sm">
          {/* Method selector tabs */}
          <div className="flex bg-background-100 p-1.5 rounded-xl mb-6">
            <button
              onClick={() => {
                setAuthMethod('otp');
                cleanStatus();
              }}
              className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${
                authMethod === 'otp'
                  ? 'bg-white text-accent-600 shadow-sm'
                  : 'text-foreground-500 hover:text-foreground-700'
              }`}
            >
              {t('auth.tab_phone', 'WhatsApp')}
            </button>
            <button
              onClick={() => {
                setAuthMethod('password');
                cleanStatus();
              }}
              className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${
                authMethod === 'password'
                  ? 'bg-white text-accent-600 shadow-sm'
                  : 'text-foreground-500 hover:text-foreground-700'
              }`}
            >
              {t('auth.tab_email', 'Email')}
            </button>
          </div>

          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-5 p-3.5 rounded-xl bg-green-50 border border-green-200 text-green-700 text-sm">
              {success}
            </div>
          )}

          {/* OTP Authentication Flow */}
          {authMethod === 'otp' && (
            <div>
              {otpStep === 1 ? (
                <form onSubmit={handleOtpRequest} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-foreground-700 mb-1.5">
                      {t('auth.phone', 'Телефон нөмірі')}
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+7 (777) 123-45-67"
                      className="w-full px-4 py-3 rounded-xl border border-background-200 bg-white text-foreground-900 focus:outline-none focus:border-accent-400 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-foreground-700 mb-1.5">
                      {t('rsvp.name.label', 'Аты-жөніңіз')} ({t('common.optional', 'таңдаулы')})
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Абылай Хан"
                      className="w-full px-4 py-3 rounded-xl border border-background-200 bg-white text-foreground-900 focus:outline-none focus:border-accent-400 transition-colors"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 rounded-xl bg-accent-500 text-white font-semibold hover:bg-accent-600 transition-colors disabled:opacity-60"
                  >
                    {loading ? t('common.loading') : t('auth.otp.btn', 'Кодты сұрату')}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleOtpVerify} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-foreground-700 mb-1.5">
                      {t('auth.otp', 'Растау коды')}
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      placeholder="123456"
                      className="w-full px-4 py-3 rounded-xl border border-background-200 bg-white text-foreground-900 focus:outline-none focus:border-accent-400 text-center tracking-widest text-lg font-bold transition-colors"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setOtpStep(1)}
                      className="flex-1 py-3 rounded-xl border border-background-200 text-foreground-700 font-semibold hover:bg-background-100 transition-colors"
                    >
                      {t('common.back', 'Артқа')}
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-[2] py-3 rounded-xl bg-accent-500 text-white font-semibold hover:bg-accent-600 transition-colors disabled:opacity-60"
                    >
                      {loading ? t('common.loading') : t('auth.otp.verify', 'Растау')}
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* Email / Password Flow */}
          {authMethod === 'password' && (
            <div>
              {passwordMode === 'login' ? (
                <form onSubmit={handleEmailLogin} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-foreground-700 mb-1.5">
                      {t('auth.email', 'Email')}
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="example@mail.com"
                      className="w-full px-4 py-3 rounded-xl border border-background-200 bg-white text-foreground-900 focus:outline-none focus:border-accent-400 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-foreground-700 mb-1.5">
                      {t('auth.password', 'Құпия сөз')}
                    </label>
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-4 py-3 rounded-xl border border-background-200 bg-white text-foreground-900 focus:outline-none focus:border-accent-400 transition-colors"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 rounded-xl bg-accent-500 text-white font-semibold hover:bg-accent-600 transition-colors disabled:opacity-60"
                  >
                    {loading ? t('common.loading') : t('auth.login.title', 'Кіру')}
                  </button>
                  <p className="text-center text-sm text-foreground-500 mt-4">
                    {t('auth.no_account', 'Аккаунт жоқ па?')}{' '}
                    <button
                      type="button"
                      onClick={() => setPasswordMode('register')}
                      className="text-accent-600 font-semibold hover:underline"
                    >
                      {t('auth.register.title', 'Тіркелу')}
                    </button>
                  </p>
                </form>
              ) : (
                <form onSubmit={handleEmailRegister} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-foreground-700 mb-1.5">
                      {t('rsvp.name.label', 'Аты-жөніңіз')}
                    </label>
                    <input
                      type="text"
                      required
                      value={registerName}
                      onChange={(e) => setRegisterName(e.target.value)}
                      placeholder="Абылай Хан"
                      className="w-full px-4 py-3 rounded-xl border border-background-200 bg-white text-foreground-900 focus:outline-none focus:border-accent-400 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-foreground-700 mb-1.5">
                      {t('auth.email', 'Email')}
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="example@mail.com"
                      className="w-full px-4 py-3 rounded-xl border border-background-200 bg-white text-foreground-900 focus:outline-none focus:border-accent-400 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-foreground-700 mb-1.5">
                      {t('auth.password', 'Құпия сөз')}
                    </label>
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Минимум 6 таңба"
                      className="w-full px-4 py-3 rounded-xl border border-background-200 bg-white text-foreground-900 focus:outline-none focus:border-accent-400 transition-colors"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 rounded-xl bg-accent-500 text-white font-semibold hover:bg-accent-600 transition-colors disabled:opacity-60"
                  >
                    {loading ? t('common.loading') : t('auth.register.title', 'Тіркелу')}
                  </button>
                  <p className="text-center text-sm text-foreground-500 mt-4">
                    {t('auth.already_registered', 'Аккаунт бар ма?')}{' '}
                    <button
                      type="button"
                      onClick={() => setPasswordMode('login')}
                      className="text-accent-600 font-semibold hover:underline"
                    >
                      {t('auth.login.title', 'Кіру')}
                    </button>
                  </p>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
