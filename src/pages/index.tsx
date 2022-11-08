import React, { useState } from 'react';
import Head from 'next/head';
import useTranslation from 'next-translate/useTranslation';
import classNames from 'classnames';

import Hoverable from 'app/components/utils/Hoverable';
import Clickable from 'app/components/utils/Clickable';
import Link from 'app/components/utils/Link';
import Layout from 'app/components/layout/Layout';
import Logo from 'app/components/ui/Logo';
import Vector from 'app/components/ui/Vector';
import LoadingIndicator from 'app/components/ui/LoadingIndicator';
import Avatar from 'app/components/ui/Avatar';
import Button from 'app/components/ui/Button';
import VectorButton from 'app/components/ui/VectorButton';
import Divider from 'app/components/ui/Divider';
import ImagePlaceholder from 'app/components/ui/ImagePlaceholder';
import CircularProgressBar from 'app/components/ui/CircularProgressBar';
import LinearProgressBar from 'app/components/ui/LinearProgressBar';
import Input, { InputValidatorCallback } from 'app/components/ui/Input';
import Checkbox from 'app/components/ui/Checkbox';

import { useBreakpoint, useEvent } from 'app/lib/hooks';
import { sleep } from 'app/lib/utils';

import { Page } from 'app/types';

import styles from 'app/styles/pages/home.module.scss';

const sleep2s = async (): Promise<void> => {
  await sleep(2000);
};

/** Страница демонстрации компонентов */
const Home: Page = () => {
  const { t } = useTranslation();
  const breakpoint = useBreakpoint();
  const [interactiveZoneLastState, setInteractiveZoneLastState] = useState('No state');

  const handleShowModal = useEvent(() => {
    // PopupMaster.show({
    //   id: 'Test Modal Left',
    //   component: () => (
    //     <PopupMessage title="Modal (left)" message="Long-long-long-long message">
    //       <Button>Left</Button>
    //       <Button type="red">Right</Button>
    //     </PopupMessage>
    //   ),
    //   from: PopupSource.Right,
    //   position: PopupPosition.Left,
    // });
    //
    // PopupMaster.show({
    //   id: 'Test Modal Right',
    //   component: () => (
    //     <PopupMessage title="Modal (right)" message="Long-long-long-long message">
    //       <Button>Left</Button>
    //       <Button type="red">Right</Button>
    //     </PopupMessage>
    //   ),
    //   from: PopupSource.Left,
    //   position: PopupPosition.Right,
    // });
  });

  const numbersValidator: InputValidatorCallback = (value: string) => {
    if (Number.isNaN(Number(value))) {
      return 'Введите число';
    }

    return null;
  };

  return (
    <>
      <Head>
        <title>{t('home-page:title')}</title>
        <meta name="description" content={t('home-page:description')} />
      </Head>
      <h1 className={styles.title}>{t('home-page:title')}</h1>
      <div className={styles.section}>
        <h2 className={styles.title}>1. {t('home-page:sections.logos')}</h2>
        <div className={styles.content}>
          <Logo />
          <div style={{ background: '#1F4F80' }}>
            <Logo type="white" />
          </div>
        </div>
      </div>
      <div className={styles.section}>
        <h2 className={styles.title}>2. {t('home-page:sections.vectors')}</h2>
        <div className={styles.content}>
          <Vector size={40} src="some-error-vector" />
          <Vector size={40} src="common/warning" color="#1F4F80" />
          <Vector size={40} src="common/warning" />
          <LoadingIndicator size={40} />
          <LoadingIndicator type="tail" size={40} color="black" />
          <LoadingIndicator type="puff" size={40} color="orange" />
          <LoadingIndicator type="oval" size={40} color="#0e9f6e" />
          <LoadingIndicator type="dots" size={40} color="#1F4F80" />
          <LoadingIndicator type="bars" size={40} />
        </div>
      </div>
      <div className={styles.section}>
        <h2 className={styles.title}>3. {t('home-page:sections.avatars')}</h2>
        <div className={styles.content}>
          <Avatar name="Test" />
          <Avatar size={64} name="tEsT oF UseR" />
          <Avatar>
            <div style={{ width: 12, height: 12, background: '#1F4F80' }} />
          </Avatar>
        </div>
      </div>
      <div className={styles.section}>
        <h2 className={styles.title}>4. {t('home-page:sections.interactive')}</h2>
        <div className={styles.content}>
          <Clickable onClick={() => setInteractiveZoneLastState('Clicked')}>
            <Hoverable
              onHover={() => setInteractiveZoneLastState('Hovered')}
              onUnhover={() => setInteractiveZoneLastState('Unhovered')}
            >
              <Button>{interactiveZoneLastState}</Button>
            </Hoverable>
          </Clickable>
        </div>
      </div>
      <div className={styles.section}>
        <h2 className={styles.title}>5. {t('home-page:sections.buttons')}</h2>
        <div className={classNames(styles.content, styles.column)}>
          <div className={styles.content}>
            <Button paddingType="small" type="green" onClick={sleep2s} lockOnClick>
              Small Green
            </Button>
            <Button paddingType="normal" type="green" onClick={sleep2s} lockOnClick>
              Normal Green
            </Button>
            <Button paddingType="large" type="green" onClick={sleep2s} lockOnClick>
              Large Green
            </Button>
          </div>
          <div className={styles.content}>
            <Button paddingType="small" type="green-outlined" onClick={sleep2s} lockOnClick>
              Small Green Outlined
            </Button>
            <Button paddingType="normal" type="green-outlined" onClick={sleep2s} lockOnClick>
              Normal Green Outlined
            </Button>
            <Button paddingType="large" type="green-outlined" onClick={sleep2s} lockOnClick>
              Large Green Outlined
            </Button>
          </div>
          <div className={styles.content}>
            <Button paddingType="small" type="gray-outlined" onClick={sleep2s} lockOnClick>
              Small Gray Outlined
            </Button>
            <Button paddingType="normal" type="gray-outlined" onClick={sleep2s} lockOnClick>
              Normal Gray Outlined
            </Button>
            <Button paddingType="large" type="gray-outlined" onClick={sleep2s} lockOnClick>
              Large Gray Outlined
            </Button>
          </div>
          <div className={styles.content}>
            <Button paddingType="small" type="red" onClick={sleep2s} lockOnClick>
              Small Red
            </Button>
            <Button paddingType="normal" type="red" onClick={sleep2s} lockOnClick>
              Normal Red
            </Button>
            <Button paddingType="large" type="red" onClick={sleep2s} lockOnClick>
              Large Red
            </Button>
          </div>
          <div className={styles.content}>
            <Button paddingType="small" type="classic" onClick={sleep2s} lockOnClick>
              Small Classic
            </Button>
            <Button paddingType="normal" type="classic" onClick={sleep2s} lockOnClick>
              Normal Classic
            </Button>
            <Button paddingType="large" type="classic" onClick={sleep2s} lockOnClick>
              Large Classic
            </Button>
          </div>
          <div className={styles.content}>
            <VectorButton src="common/image" size={40} />
            <VectorButton src="common/arrow-long" size={40} />
            <VectorButton src="loaders/puff" size={40} />
            <VectorButton src="common/image" size={40} />
          </div>
        </div>
      </div>
      <div className={styles.section}>
        <h2 className={styles.title}>6. {t('home-page:sections.dividers')}</h2>
        <div className={styles.content}>
          <Divider />
          <Divider color="#FF0101" thickness={3} />
          <Divider color="#1F4F80" length={70} thickness={10} />
          <Divider direction="vertical" color="#0E9285" length={50} thickness={10} />
          <Divider color="#1F4F80" length={70} thickness={10} />
          <Divider color="#FF0101" thickness={3} />
          <Divider />
        </div>
      </div>
      <div className={styles.section}>
        <h2 className={styles.title}>7. {t('home-page:sections.placeholder')}</h2>
        <div className={styles.content}>
          <ImagePlaceholder width={300} height={100} />
          <ImagePlaceholder width={100} height={140} />
          <ImagePlaceholder width={300} height={100} />
        </div>
      </div>
      <div className={styles.section}>
        <h2 className={styles.title}>8. {t('home-page:sections.links')}</h2>
        <div className={classNames(styles.content, styles.column)}>
          <div className={styles.content}>
            <Link href="/second">
              <Button>Second page</Button>
            </Link>
            <Link href="/second" newTab>
              <Button>Second page (new tab)</Button>
            </Link>
          </div>
          <div className={styles.content}>
            <Link href={{ pathname: '/second' }} newTab>
              <Button>Second page (new tab, URL obj)</Button>
            </Link>
            <Link href="https://github.com" newTab>
              <Button>GitHub (new tab)</Button>
            </Link>
          </div>
        </div>
      </div>
      <div className={styles.section}>
        <h2 className={styles.title}>9. {t('home-page:sections.modals')}</h2>
        <div className={styles.content}>
          <Button onClick={handleShowModal}>✉️✉️✉️</Button>
        </div>
      </div>
      <div className={styles.section}>
        <h2 className={styles.title}>10. {t('home-page:sections.progress-bars')}</h2>
        <div className={classNames(styles.content, styles.column)}>
          <div className={styles.content}>
            <CircularProgressBar progress={0.4} size={48}>
              L
            </CircularProgressBar>
            <CircularProgressBar progress={0.95} size={48}>
              95%
            </CircularProgressBar>
            <CircularProgressBar progress={0.8} size={48}>
              R
            </CircularProgressBar>
          </div>
          <LinearProgressBar progress={0.8}>Top</LinearProgressBar>
          <LinearProgressBar progress={0.4}>40%</LinearProgressBar>
          <LinearProgressBar progress={0.77}>Down</LinearProgressBar>
        </div>
      </div>
      <div className={styles.section}>
        <h2 className={styles.title}>11. {t('home-page:sections.inputs')}</h2>
        <div className={classNames(styles.content)}>
          <Input validator={numbersValidator} value="123" placeholder="Numbers" />
          <Input icon="common/image" initialValue="fef" iconRight="common/arrow-long" placeholder="Text" />
          <Input type="password" placeholder="Password" />
          <Input type="tel" placeholder="Phone" />
        </div>
      </div>
      <div className={styles.section}>
        <h2 className={styles.title}>12. {t('home-page:sections.checkboxes')}</h2>
        <div className={classNames(styles.content, styles.column)}>
          <div className={classNames(styles.content)}>
            <div className={styles.content}>
              <Checkbox initialChecked>Checkbox</Checkbox>
              <Checkbox initialChecked type="radio">
                Radio
              </Checkbox>
              <Checkbox type="toggle">Toggle</Checkbox>
            </div>
          </div>
          <div className={classNames(styles.content)}>
            <div className={styles.content}>
              <Checkbox disabled>Checkbox (Disabled)</Checkbox>
              <Checkbox type="radio" disabled>
                Radio (Disabled)
              </Checkbox>
              <Checkbox type="toggle" disabled>
                Toggle (Disabled)
              </Checkbox>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.section}>
        <h2 className={styles.title}>13. {t('home-page:sections.responsive')}</h2>
        <div className={classNames(styles.content, styles.column)}>
          <h3>Window size: {breakpoint}</h3>
        </div>
      </div>
    </>
  );
};

Home.layout = {
  key: 'general-layout',
  getLayout: (page) => <Layout>{page}</Layout>,
};

export default Home;
