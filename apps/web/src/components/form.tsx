import { Button } from "@repo/ui/components/button";
import { Checkbox } from "@repo/ui/components/checkbox";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
  FieldTitle,
} from "@repo/ui/components/field";
import { Input } from "@repo/ui/components/input";
import {
  InputGroup,
  InputGroupInput,
  InputGroupAddon,
  InputGroupButton,
} from "@repo/ui/components/input-group";
import { RadioGroup, RadioGroupItem } from "@repo/ui/components/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/select";
import { Switch } from "@repo/ui/components/switch";
import { Textarea } from "@repo/ui/components/textarea";
import { IconEye, IconEyeOff } from "@tabler/icons-react";
import { createFormHook, createFormHookContexts } from "@tanstack/react-form-start";
import { Link } from "@tanstack/react-router";
import { useState } from "react";

export const { fieldContext, formContext, useFieldContext, useFormContext } =
  createFormHookContexts();

type InputFieldProps = {
  readonly label: string;
  readonly placeholder: string;
  readonly type: string;
  readonly description?: string;
  readonly required?: boolean;
};

export const InputField = ({
  label,
  placeholder,
  type,
  description,
  required,
}: InputFieldProps) => {
  const field = useFieldContext<string>();

  const [error] = field.state.meta.errors;
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

  return (
    <Field data-invalid={isInvalid}>
      <FieldLabel htmlFor={field.name}>
        {label} {required && <span className="text-destructive">*</span>}
      </FieldLabel>

      <Input
        id={field.name}
        name={field.name}
        value={field.state.value}
        onBlur={field.handleBlur}
        onChange={(e) => field.handleChange(e.target.value)}
        aria-invalid={isInvalid}
        placeholder={placeholder}
        autoComplete="off"
        type={type}
      />

      {description && !error && <FieldDescription>{description}</FieldDescription>}

      {isInvalid && <FieldError errors={field.state.meta.errors} />}
    </Field>
  );
};

type PasswordFieldProps = {
  readonly label: string;
  readonly placeholder: string;
  readonly description?: string;
  readonly autoComplete?: string;
  readonly action?: React.ReactNode;
  readonly required?: boolean;
};

export const PasswordField = ({
  label,
  placeholder,
  description,
  autoComplete,
  action,
  required,
}: PasswordFieldProps) => {
  const field = useFieldContext<string>();
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const [error] = field.state.meta.errors;
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

  return (
    <Field data-invalid={isInvalid}>
      <FieldLabel htmlFor={field.name}>
        {label} {required && <span className="text-destructive">*</span>}
        {action && action}
      </FieldLabel>

      <InputGroup>
        <InputGroupInput
          id={field.name}
          name={field.name}
          value={field.state.value}
          onBlur={field.handleBlur}
          onChange={(e) => field.handleChange(e.target.value)}
          aria-invalid={isInvalid}
          placeholder={placeholder}
          autoComplete={autoComplete ?? "new-password"}
          type={showPassword ? "text" : "password"}
        />

        <InputGroupAddon align="inline-end">
          <InputGroupButton
            aria-label="Toggle password visibility"
            title="Toggle password visibility"
            size="icon-xs"
            onClick={() => {
              setShowPassword(!showPassword);
            }}
          >
            {showPassword ? <IconEyeOff /> : <IconEye />}
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>

      {description && !error && <FieldDescription>{description}</FieldDescription>}

      {isInvalid && <FieldError errors={field.state.meta.errors} />}
    </Field>
  );
};

type TextareaFieldProps = {
  readonly label: string;
  readonly placeholder: string;
  readonly description?: string;
};

export const TextareaField = ({ label, placeholder, description }: TextareaFieldProps) => {
  const field = useFieldContext<string>();

  const [error] = field.state.meta.errors;
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

  return (
    <Field data-invalid={isInvalid}>
      <FieldLabel htmlFor={field.name}>{label}</FieldLabel>

      <Textarea
        id={field.name}
        name={field.name}
        value={field.state.value}
        onBlur={field.handleBlur}
        onChange={(e) => field.handleChange(e.target.value)}
        aria-invalid={isInvalid}
        placeholder={placeholder}
      />

      {description && !error && <FieldDescription>{description}</FieldDescription>}

      {isInvalid && <FieldError errors={field.state.meta.errors} />}
    </Field>
  );
};

type SelectFieldProps = {
  readonly label: string;
  readonly placeholder: string;
  readonly description?: string;
  readonly options: readonly string[];
};

export const SelectField = ({ label, placeholder, description, options }: SelectFieldProps) => {
  const field = useFieldContext<string>();

  const [error] = field.state.meta.errors;
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

  return (
    <Field orientation="responsive" data-invalid={isInvalid}>
      <FieldContent>
        <FieldLabel htmlFor={field.name}>{label}</FieldLabel>

        {description && !error && <FieldDescription>{description}</FieldDescription>}

        {isInvalid && <FieldError errors={field.state.meta.errors} />}
      </FieldContent>

      <Select name={field.name} value={field.state.value} onValueChange={field.handleChange}>
        <SelectTrigger id={field.name} aria-invalid={isInvalid}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>

        <SelectContent position="item-aligned">
          {options.map((option) => (
            <SelectItem key={option} value={option}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </Field>
  );
};

type CheckboxFieldProps = {
  readonly legend: string;
  readonly label: string;
  readonly description?: string;
};

export const CheckboxField = ({ legend, label, description }: CheckboxFieldProps) => {
  const field = useFieldContext<boolean>();

  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

  return (
    <FieldSet>
      <FieldLegend variant="label">{legend}</FieldLegend>

      {description && <FieldDescription>{description}</FieldDescription>}

      <FieldGroup data-slot="checkbox-group">
        <Field orientation="horizontal" data-invalid={isInvalid}>
          <Checkbox
            id={field.name}
            name={field.name}
            aria-invalid={isInvalid}
            checked={field.state.value}
            onCheckedChange={(checked) => field.handleChange(checked === true)}
          />

          <FieldLabel htmlFor={field.name} className="font-normal">
            {label}
          </FieldLabel>
        </Field>
      </FieldGroup>

      {isInvalid && <FieldError errors={field.state.meta.errors} />}
    </FieldSet>
  );
};

type MultipleCheckboxFieldProps = {
  readonly legend: string;
  readonly description?: string;
  readonly options: readonly { id: string; label: string }[];
};

export const MultipleCheckboxField = ({
  legend,
  description,
  options,
}: MultipleCheckboxFieldProps) => {
  const field = useFieldContext<string[]>();

  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

  return (
    <FieldSet>
      <FieldLegend variant="label">{legend}</FieldLegend>

      {description && <FieldDescription>{description}</FieldDescription>}

      <FieldGroup data-slot="checkbox-group">
        {options.map((option) => (
          <Field key={option.id} orientation="horizontal" data-invalid={isInvalid}>
            <Checkbox
              id={option.id}
              name={field.name}
              aria-invalid={isInvalid}
              checked={field.state.value.includes(option.id)}
              onCheckedChange={(checked) => {
                if (checked) {
                  field.pushValue(option.id);
                } else {
                  const index = field.state.value.indexOf(option.id);
                  if (index > -1) {
                    field.removeValue(index);
                  }
                }
              }}
            />

            <FieldLabel htmlFor={option.id} className="font-normal">
              {option.label}
            </FieldLabel>
          </Field>
        ))}
      </FieldGroup>

      {isInvalid && <FieldError errors={field.state.meta.errors} />}
    </FieldSet>
  );
};

type RadioFieldProps = {
  readonly legend: string;
  readonly description?: string;
  readonly options: readonly { id: string; title: string; description?: string }[];
};

export const RadioField = ({ legend, description, options }: RadioFieldProps) => {
  const field = useFieldContext<string>();

  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

  return (
    <FieldSet>
      <FieldLegend variant="label">{legend}</FieldLegend>

      {description && <FieldDescription>{description}</FieldDescription>}

      <RadioGroup name={field.name} value={field.state.value} onValueChange={field.handleChange}>
        {options.map((option) => (
          <FieldLabel key={option.id} htmlFor={option.id}>
            <Field orientation="horizontal" data-invalid={isInvalid}>
              <FieldContent>
                <FieldTitle>{option.title}</FieldTitle>

                {option.description && <FieldDescription>{option.description}</FieldDescription>}
              </FieldContent>

              <RadioGroupItem value={option.id} id={option.id} aria-invalid={isInvalid} />
            </Field>
          </FieldLabel>
        ))}
      </RadioGroup>

      {isInvalid && <FieldError errors={field.state.meta.errors} />}
    </FieldSet>
  );
};

type SwitchFieldProps = {
  readonly label: string;
  readonly description?: string;
};

export const SwitchField = ({ label, description }: SwitchFieldProps) => {
  const field = useFieldContext<boolean>();

  const [error] = field.state.meta.errors;
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

  return (
    <Field orientation="horizontal" data-invalid={isInvalid}>
      <FieldContent>
        <FieldLabel htmlFor={field.name}>{label}</FieldLabel>

        {description && !error && <FieldDescription>{description}</FieldDescription>}

        {isInvalid && <FieldError errors={field.state.meta.errors} />}
      </FieldContent>

      <Switch
        id={field.name}
        name={field.name}
        checked={field.state.value}
        onCheckedChange={field.handleChange}
        aria-invalid={isInvalid}
      />
    </Field>
  );
};

type SubmitButtonProps = {
  readonly label: string;
  readonly loadingLabel?: string;
};

export const SubmitButton = ({ label, loadingLabel }: SubmitButtonProps) => {
  const form = useFormContext();

  return (
    <form.Subscribe selector={(state) => [state.isSubmitting, state.canSubmit]}>
      {([isSubmitting, canSubmit]) => (
        <Button type="submit" disabled={isSubmitting || !canSubmit}>
          {isSubmitting ? (loadingLabel ?? "Submitting...") : label}
        </Button>
      )}
    </form.Subscribe>
  );
};

export const TermsOfServiceField = () => {
  return (
    <Field>
      <FieldDescription className="text-center text-xs">
        By clicking continue, you agree to our <Link to="/">Terms of Service</Link>.
      </FieldDescription>
    </Field>
  );
};

export const { useAppForm } = createFormHook({
  fieldComponents: {
    InputField,
    PasswordField,
    TextareaField,
    SelectField,
    CheckboxField,
    MultipleCheckboxField,
    RadioField,
    SwitchField,
  },
  formComponents: {
    SubmitButton,
    TermsOfServiceField,
  },
  fieldContext,
  formContext,
});
