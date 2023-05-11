import React, { useState } from 'react';
import Head from 'next/head';
import useTranslation from 'next-translate/useTranslation';
import { useDisclosure } from '@mantine/hooks';
import classNames from 'classnames';

import Checkbox from 'app/components/input/Checkbox';
import Input, { type InputValidatorCallback } from 'app/components/input/Input';
import MultilineInput from 'app/components/input/MultilineInput';
import OtpInput from 'app/components/input/OtpInput';
import PhoneInput from 'app/components/input/PhoneInput';
import Select, { type SelectOption } from 'app/components/input/Select';
import Layout from 'app/components/layout/Layout';
import Avatar from 'app/components/ui/Avatar';
import Button from 'app/components/ui/Button';
import Calendar from 'app/components/ui/Calendar';
import CircularProgressBar from 'app/components/ui/CircularProgressBar';
import Divider from 'app/components/ui/Divider';
import ImagePlaceholder from 'app/components/ui/ImagePlaceholder';
import LinearProgressBar from 'app/components/ui/LinearProgressBar';
import LoadingIndicator from 'app/components/ui/LoadingIndicator';
import Logo from 'app/components/ui/Logo';
import Map from 'app/components/ui/Map';
import Modal from 'app/components/ui/Modal';
import Popover from 'app/components/ui/Popover';
import Table from 'app/components/ui/Table';
import Vector from 'app/components/ui/Vector';
import VectorButton from 'app/components/ui/VectorButton';
import Clickable from 'app/components/utils/Clickable';
import Hoverable from 'app/components/utils/Hoverable';
import Link from 'app/components/utils/Link';
import { useBreakpoint, useEvent } from 'app/lib/hooks';
import { sleep } from 'app/lib/utils';
import { type Page } from 'app/types';

import styles from 'app/styles/pages/home.module.scss';

/** Останавливает выполнение async-функции на 2 секунды */
const sleep2s = async (): Promise<void> => {
  await sleep(2000);
};

const selectOptions: SelectOption<number>[] = [];
for (let i = 0; i < 50_000; i++) {
  selectOptions.push({
    value: i,
    label: `Label of item with value "${i}"`,
  });
}

/** Страница демонстрации компонентов */
const Home: Page = () => {
  const { t } = useTranslation();
  const { breakpoint } = useBreakpoint();
  const [interactiveZoneLastState, setInteractiveZoneLastState] = useState('No state');
  const [modalOpen, { toggle: toggleModalOpen }] = useDisclosure(false);

  /** Проверяет содержит ли строка допустимое число */
  const numbersValidator = useEvent<InputValidatorCallback>((value) => {
    if (Number.isNaN(Number(value))) {
      return 'Введите число';
    }
  });

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
        <Calendar />
        <div style={{ margin: 5, maxWidth: 300 }}>
          <Select
            label="Some label"
            placeholder="Some placeholder"
            options={selectOptions}
          />
        </div>
        <Map />
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
            <Popover content={<p>Clicked!</p>}>
              <Button type="primary" onClick={sleep2s} lockOnClick>
                Primary
              </Button>
            </Popover>

            <Popover content={<p>Clicked!</p>}>
              <Button type="secondary" onClick={sleep2s} lockOnClick>
                Secondary
              </Button>
            </Popover>
          </div>
          <div className={styles.content}>
            <VectorButton src="common/image" size={40} />
            <VectorButton src="common/squares-2x2" size={40} />
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
          <Button onClick={toggleModalOpen}>✉️✉️✉️</Button>
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
          <Input
            validator={numbersValidator}
            value="123"
            placeholder="Numbers"
            maxLength={10}
          />
          <Input
            type="text"
            initialValue="Initial"
            placeholder="Text"
            autoComplete="family-name"
            iconLeft="common/image"
            iconRight="common/squares-2x2"
          />
          <Input
            type="password"
            placeholder="Password"
            maxLength={10}
          />
          <PhoneInput
            iconLeft="common/image"
            placeholder="Phone"
          />
          <MultilineInput
            initialValue="Initial"
            placeholder="Text"
            autoComplete="family-name"
            enterKeyHint="search"
            iconLeft="common/image"
            iconRight="common/squares-2x2"
            maxRows={5}
          />
          <OtpInput
            length={4}
            enterKeyHint="go"
            validator={(value) => {
              if (value.toLowerCase() === 'fuck') {
                return 'Huh?';
              }
            }}
          />
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

      <Modal open={modalOpen} onClose={toggleModalOpen} label="Modal">
        <p>Long-long-long-long message</p>
        <Table
          data={[
            {
              s1: 'string',
              s2: 'string',
              d1: Date.now(),
              n1: 123,
            },
          ]}
          columns={[
            {
              key: 's1',
              title: 'Title s1',
              render: (cell) => cell,
            },
            {
              key: 's2',
              title: 'Title s2',
            },
            {
              key: 'd1',
              title: 'Title d1',
              render: (cell) => new Date(cell),
            },
            {
              key: 'n1',
              title: 'Title n1',
              render: (cell) => <strong>{cell}</strong>,
            },
            {
              title: 'Title null',
              render: (cell, row) => `Val of s1: ${row.s1}`,
            },
          ]}
        />
      </Modal>
    </>
  );
};

Home.layout = {
  key: 'general-layout',
  getLayout: (page) => <Layout>{page}</Layout>,
};

export default Home;
