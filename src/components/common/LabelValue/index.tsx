function LabelValue({ label, value }: { label: string; value: string }) {
  return (
    <div className="alignValueRow alignLeft">
      <div>
        <em>{label}</em>
      </div>
      <div>{value}</div>
    </div>
  );
}

export default LabelValue;
