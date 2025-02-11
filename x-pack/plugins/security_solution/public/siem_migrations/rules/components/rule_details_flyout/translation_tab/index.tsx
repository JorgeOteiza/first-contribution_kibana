/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import React, { useMemo } from 'react';
import {
  EuiAccordion,
  EuiBadge,
  EuiFieldText,
  EuiFlexGroup,
  EuiFlexItem,
  EuiFormRow,
  EuiSpacer,
  EuiSplitPanel,
  EuiTitle,
  useEuiTheme,
} from '@elastic/eui';
import { css } from '@emotion/css';
import { FormattedMessage } from '@kbn/i18n-react';
import type { RuleResponse } from '../../../../../../common/api/detection_engine';
import type { RuleMigration } from '../../../../../../common/siem_migrations/model/rule_migration.gen';
import { TranslationTabHeader } from './header';
import { MigrationRuleQuery } from './migration_rule_query';
import * as i18n from './translations';
import {
  convertTranslationResultIntoColor,
  convertTranslationResultIntoText,
} from '../../../utils/helpers';

interface TranslationTabProps {
  ruleMigration: RuleMigration;
  matchedPrebuiltRule?: RuleResponse;
}

export const TranslationTab: React.FC<TranslationTabProps> = React.memo(
  ({ ruleMigration, matchedPrebuiltRule }) => {
    const { euiTheme } = useEuiTheme();

    const name = useMemo(
      () => ruleMigration.elastic_rule?.title ?? ruleMigration.original_rule.title,
      [ruleMigration.elastic_rule?.title, ruleMigration.original_rule.title]
    );
    const originalQuery = ruleMigration.original_rule.query;
    const elasticQuery = useMemo(() => {
      let query = ruleMigration.elastic_rule?.query;
      if (matchedPrebuiltRule && matchedPrebuiltRule.type !== 'machine_learning') {
        query = matchedPrebuiltRule.query;
      }
      return query ?? '';
    }, [matchedPrebuiltRule, ruleMigration.elastic_rule?.query]);

    return (
      <>
        <EuiSpacer size="m" />
        <EuiFormRow label={i18n.NAME_LABEL} fullWidth>
          <EuiFieldText value={name} fullWidth />
        </EuiFormRow>
        <EuiSpacer size="m" />
        <EuiAccordion
          id="translationQueryItem"
          buttonContent={<TranslationTabHeader />}
          initialIsOpen={true}
        >
          <EuiFlexItem>
            <EuiSpacer size="s" />
            <EuiSplitPanel.Outer grow hasShadow={false} hasBorder={true}>
              <EuiSplitPanel.Inner grow={false} color="subdued" paddingSize="s">
                <EuiFlexGroup justifyContent="flexEnd">
                  <EuiFlexItem grow={false}>
                    <EuiTitle size="xxs">
                      <h2>
                        <FormattedMessage
                          id="xpack.securitySolution.detectionEngine.translationDetails.translationTab.statusTitle"
                          defaultMessage="Translation status"
                        />
                      </h2>
                    </EuiTitle>
                  </EuiFlexItem>
                  <EuiFlexItem grow={false}>
                    <EuiBadge
                      color={convertTranslationResultIntoColor(ruleMigration.translation_result)}
                      onClick={() => {}}
                      onClickAriaLabel={'Click to update translation status'}
                    >
                      {convertTranslationResultIntoText(ruleMigration.translation_result)}
                    </EuiBadge>
                  </EuiFlexItem>
                </EuiFlexGroup>
              </EuiSplitPanel.Inner>
              <EuiSplitPanel.Inner grow>
                <EuiFlexGroup gutterSize="s" alignItems="flexStart">
                  <EuiFlexItem grow={1}>
                    <MigrationRuleQuery
                      title={i18n.SPLUNK_QUERY_TITLE}
                      query={originalQuery}
                      canEdit={false}
                    />
                  </EuiFlexItem>
                  <EuiFlexItem
                    grow={0}
                    css={css`
                      align-self: stretch;
                      border-right: ${euiTheme.border.thin};
                    `}
                  />
                  <EuiFlexItem grow={1}>
                    <MigrationRuleQuery
                      title={
                        matchedPrebuiltRule
                          ? i18n.PREBUILT_RULE_QUERY_TITLE
                          : i18n.ESQL_TRANSLATION_TITLE
                      }
                      query={elasticQuery}
                      canEdit={false}
                    />
                  </EuiFlexItem>
                </EuiFlexGroup>
              </EuiSplitPanel.Inner>
            </EuiSplitPanel.Outer>
          </EuiFlexItem>
        </EuiAccordion>
      </>
    );
  }
);
TranslationTab.displayName = 'TranslationTab';
