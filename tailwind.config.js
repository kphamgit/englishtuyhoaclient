/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        bgColor0: 'var(--bgColor0)',
        textColor0: 'var(--textColor0)',
        bgColor1: 'var(--bgColor1)',
        textColor1: 'var(--textColor1)',
        bgColor2: 'var(--bgColor2)',
        textColor2: 'var(--textColor2)',
        bgColor3: 'var(--bgColor3)',
        textColor3: 'var(--textColor3)',
        bgColor4: 'var(--bgColor4)',
        textColor4: 'var(--textColor4)',

        textColorTipTapMenuBtn: 'var(--textColorTipTapMenuBtn)',
        textColorTipTapMenuBtnActive: 'var(--textColorTipTapMenuBtnActive)',
        textColorTipTapMenuBtnHover: 'var(--textColorTipTapMenuBtnHover)',
        bgColorTipTapMenuBtn: 'var(--bgColorTipTapMenuBtn)',
        bgColorTipTapMenuBtnActive: 'var(--bgColorTipTapMenuBtnActive)',
        bgColorTipTapMenuBtnHover: 'var(--bgColorTipTapMenuBtnHover)',

        navCatButtonBgActive: 'var(--navCatButtonBgActive)',
        navCatButtonBgInActive: 'var(--navCatButtonBgInActive)',
        navCatButtonBgInHover: 'var(--navCatButtonBgHover)',
        questionAttemptBg: 'var(--questionAttemptBg)',
        questionAttemptText: 'var(--questionAttemptText)',
        userNavText: 'var(--userNavText)',
        takeQuizButtonBg: 'var(--takeQuizButtonBg)',
        takeQuizButtonText: 'var(--takeQuizButtonText)',
      },
    },
  },
  plugins: [],
}

/*
-textColorTipTapMenuBtn: #e4cece;
  --textColorTipTapMenuBtnActive: #e4cece;
  --textColorTipTapMenuBtnHover: #e4cece;

  --bgColorTipTapMenuBtn: #e4cece;
  --bgColorTipTapMenuBtnActive: #e4cece;
  --bgColorTipTapMenuBtnHover: #e4cece;
*/