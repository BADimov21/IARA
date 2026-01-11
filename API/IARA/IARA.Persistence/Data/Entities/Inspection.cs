using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace IARA.Persistence.Data.Entities;

[Index("InspectionDateTime", Name = "IX_Inspections_DateTime")]
[Index("InspectorId", Name = "IX_Inspections_InspectorId")]
public partial class Inspection
{
    [Key]
    public int Id { get; set; }

    public int InspectorId { get; set; }

    public DateTime InspectionDateTime { get; set; }

    [StringLength(50)]
    public string InspectionType { get; set; } = null!;

    public int? VesselId { get; set; }

    public int? BatchId { get; set; }

    public int? TicketPurchaseId { get; set; }

    public bool IsCompliant { get; set; }

    [StringLength(200)]
    public string? Location { get; set; }

    [StringLength(1000)]
    public string? Observations { get; set; }

    [ForeignKey("BatchId")]
    [InverseProperty("Inspections")]
    public virtual FishBatch? Batch { get; set; }

    [ForeignKey("InspectorId")]
    [InverseProperty("Inspections")]
    public virtual Inspector Inspector { get; set; } = null!;

    [ForeignKey("TicketPurchaseId")]
    [InverseProperty("Inspections")]
    public virtual TicketPurchase? TicketPurchase { get; set; }

    [ForeignKey("VesselId")]
    [InverseProperty("Inspections")]
    public virtual Vessel? Vessel { get; set; }

    [InverseProperty("Inspection")]
    public virtual ICollection<Violation> Violations { get; set; } = new List<Violation>();
}
