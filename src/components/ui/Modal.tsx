import { cn } from '@/lib/utils';
import * as Dialog from '@radix-ui/react-dialog';

const Root = Dialog.Root;
const Trigger = Dialog.Trigger;
const Close = Dialog.Close;
const Title = Dialog.Title;
const Description = Dialog.Description;

type ModalProps = Dialog.DialogProps

type ContentProps = Dialog.DialogContentProps & {
  title?: string;
  description?: string;
};

const Content = ({ title, description, children, ...props }: ContentProps) => (
  <Dialog.Portal>
    <Dialog.Overlay className="bg-overlay data-[state=open]:animate-overlayShow fixed inset-0" />
    <Dialog.Content {...props} className={cn("data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded-lg bg-background border border-foreground/40 p-6 shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none", props.className)}>
      {title && (
        <Dialog.Title className="text-foreground m-0 text-xl font-medium">
          {title}
        </Dialog.Title>
      )}
      {description && (
        <Dialog.Description className="text-muted-foreground mb-5 text-base leading-normal">
          {description}
        </Dialog.Description>
      )}
      {children}
    </Dialog.Content>
  </Dialog.Portal>
)

export const Modal = {
  Root,
  Trigger,
  Content,
  Close,
  Title,
  Description
};

export type {
  ModalProps
}