import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button, ButtonGroup } from '@mui/material';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    document.dir = lng === 'ar' ? 'rtl' : 'ltr';
  };

  return (
    <ButtonGroup variant="contained" size="small">
      <Button
        onClick={() => changeLanguage('en')}
        color={i18n.language === 'en' ? 'primary' : 'inherit'}
      >
        English
      </Button>
      <Button
        onClick={() => changeLanguage('ar')}
        color={i18n.language === 'ar' ? 'primary' : 'inherit'}
      >
        العربية
      </Button>
    </ButtonGroup>
  );
};

export default LanguageSwitcher; 