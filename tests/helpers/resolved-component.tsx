export const resolveServerSideComponent = async (
  Component: Function,
  props: any
) => {
  const ComponentResolved = await Component(props);
  return () => ComponentResolved;
};
