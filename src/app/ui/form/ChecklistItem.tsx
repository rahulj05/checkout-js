import { FieldProps } from 'formik';
import { kebabCase } from 'lodash';
import React, { memo, useCallback, useContext, FunctionComponent, ReactNode } from 'react';

import { memoize } from '../../common/utility';
import { AccordionItem, AccordionItemHeaderProps } from '../accordion';

import BasicFormField from './BasicFormField';
import { ChecklistContext } from './Checklist';
import ChecklistItemInput from './ChecklistItemInput';

export interface ChecklistItemProps {
    content?: ReactNode;
    htmlId?: string;
    label: ReactNode | ((isSelected: boolean) => ReactNode);
    value: string;
}

const ChecklistItem: FunctionComponent<ChecklistItemProps> = ({
    value,
    content,
    htmlId = kebabCase(value),
    label,
    ...rest
}) => {
    const { name = '' } = useContext(ChecklistContext) || {};

    const renderInput = useCallback(memoize((isSelected: boolean) => ({ field }: FieldProps) => (
        <ChecklistItemInput
            { ...field }
            isSelected={ field.value === value }
            id={ htmlId }
            value={ value }
        >
            { label instanceof Function ?
                label(isSelected) :
                label }
        </ChecklistItemInput>
    )), [
        htmlId,
        label,
        value,
    ]);

    const handleChange = useCallback(memoize((onToggle: (id: string) => void) => (selectedValue: string) => {
        if (value === selectedValue) {
            onToggle(value);
        }
    }), []);

    const renderHeaderContent = useCallback(({
        isSelected,
        onToggle,
    }: AccordionItemHeaderProps) => (
        <BasicFormField
            className="form-checklist-option"
            name={ name }
            onChange={ handleChange(onToggle) }
            render={ renderInput(isSelected) }
        />
    ), [
        handleChange,
        name,
        renderInput,
    ]);

    return (
        <AccordionItem
            { ...rest }
            bodyClassName="form-checklist-body"
            className="form-checklist-item optimizedCheckout-form-checklist-item"
            classNameSelected="form-checklist-item--selected optimizedCheckout-form-checklist-item--selected"
            headerClassName="form-checklist-header"
            headerClassNameSelected="form-checklist-header--selected"
            headerContent={ renderHeaderContent }
            itemId={ value }
        >
            { content }
        </AccordionItem>
    );
};

export default memo(ChecklistItem);