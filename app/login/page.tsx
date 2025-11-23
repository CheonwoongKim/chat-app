'use client';

import { CSSProperties } from 'react';
import { KBLogo } from '@/components/KBLogo';
import { useLogin } from '@/hooks/useLogin';

const styles: Record<string, CSSProperties> = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'var(--color-background)',
    padding: '20px',
  },
  formWrapper: {
    width: '100%',
    maxWidth: '400px',
  },
  logoContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '16px',
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: 'var(--color-text-primary)',
    textAlign: 'center',
    marginBottom: '32px',
  },
  inputGroup: {
    marginBottom: '20px',
  },
  label: {
    display: 'block',
    fontSize: '14px',
    fontWeight: '500',
    color: 'var(--color-text-primary)',
    marginBottom: '8px',
  },
  input: {
    width: '100%',
    height: '56px',
    padding: '0 16px',
    fontSize: '14px',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--border-radius-md)',
    backgroundColor: 'var(--color-white)',
    color: 'var(--color-text-primary)',
    outline: 'none',
    transition: 'border-color 0.2s',
  },
  errorMessage: {
    padding: '12px',
    marginBottom: '20px',
    backgroundColor: '#fee',
    border: '1px solid #fcc',
    borderRadius: 'var(--border-radius-md)',
    color: '#c33',
    fontSize: '14px',
  },
  button: {
    width: '100%',
    height: '56px',
    fontSize: '16px',
    fontWeight: '600',
    border: 'none',
    borderRadius: 'var(--border-radius-md)',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  copyright: {
    marginTop: '40px',
    textAlign: 'center',
    fontSize: '12px',
    color: 'var(--color-text-secondary)',
  },
};

export default function LoginPage() {
  const { email, setEmail, password, setPassword, isLoading, error, login } = useLogin();

  const handleInputFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.currentTarget.style.borderColor = 'var(--color-text-primary)';
  };

  const handleInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    e.currentTarget.style.borderColor = 'var(--color-border)';
  };

  const handleButtonMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!isLoading) {
      e.currentTarget.style.backgroundColor = '#2a2a2a';
    }
  };

  const handleButtonMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!isLoading) {
      e.currentTarget.style.backgroundColor = 'var(--color-text-primary)';
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.formWrapper}>
        <div style={styles.logoContainer}>
          <KBLogo size={60} />
        </div>

        <h1 style={styles.title}>KB AI Assistant</h1>

        <form onSubmit={login}>
          <div style={styles.inputGroup}>
            <label htmlFor="email" style={styles.label}>
              이메일
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="이메일을 입력하세요"
              required
              disabled={isLoading}
              style={styles.input}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
            />
          </div>

          <div style={{ ...styles.inputGroup, marginBottom: '24px' }}>
            <label htmlFor="password" style={styles.label}>
              비밀번호
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호를 입력하세요"
              required
              disabled={isLoading}
              style={styles.input}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
            />
          </div>

          {error && <div style={styles.errorMessage}>{error}</div>}

          <button
            type="submit"
            disabled={isLoading}
            style={{
              ...styles.button,
              backgroundColor: isLoading ? '#ccc' : 'var(--color-text-primary)',
              color: 'var(--color-white)',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              opacity: isLoading ? 0.7 : 1,
            }}
            onMouseEnter={handleButtonMouseEnter}
            onMouseLeave={handleButtonMouseLeave}
          >
            {isLoading ? '로그인 중...' : '로그인'}
          </button>
        </form>

        <div style={styles.copyright}>
          © {new Date().getFullYear()} KB Kookmin Card. All rights reserved.
        </div>
      </div>
    </div>
  );
}
