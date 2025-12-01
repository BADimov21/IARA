using System;
using System.Collections.Generic;
using IARA.Persistence.Migrations;
using Microsoft.EntityFrameworkCore;

namespace IARA.Persistence.Data;

public partial class IARADbContext : DbContext
{
    public IARADbContext()
    {
    }

    public IARADbContext(DbContextOptions<IARADbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<BatchLocation> BatchLocations { get; set; }

    public virtual DbSet<Catch> Catches { get; set; }

    public virtual DbSet<EngineType> EngineTypes { get; set; }

    public virtual DbSet<FishBatch> FishBatches { get; set; }

    public virtual DbSet<FishSpecy> FishSpecies { get; set; }

    public virtual DbSet<FishingGear> FishingGears { get; set; }

    public virtual DbSet<FishingGearType> FishingGearTypes { get; set; }

    public virtual DbSet<FishingOperation> FishingOperations { get; set; }

    public virtual DbSet<FishingPermit> FishingPermits { get; set; }

    public virtual DbSet<FishingTrip> FishingTrips { get; set; }

    public virtual DbSet<Inspection> Inspections { get; set; }

    public virtual DbSet<Inspector> Inspectors { get; set; }

    public virtual DbSet<Landing> Landings { get; set; }

    public virtual DbSet<Person> Persons { get; set; }

    public virtual DbSet<RecreationalCatch> RecreationalCatches { get; set; }

    public virtual DbSet<TELKDecision> TELKDecisions { get; set; }

    public virtual DbSet<TicketPurchase> TicketPurchases { get; set; }

    public virtual DbSet<TicketType> TicketTypes { get; set; }

    public virtual DbSet<Vessel> Vessels { get; set; }

    public virtual DbSet<Violation> Violations { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see https://go.microsoft.com/fwlink/?LinkId=723263.
        => optionsBuilder.UseSqlServer("Server=(localdb)\\MSSQLLocalDB;Database=IARA;Trusted_Connection=True;TrustServerCertificate=True");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<BatchLocation>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__BatchLoc__3214EC07D580DB2D");

            entity.HasOne(d => d.Batch).WithMany(p => p.BatchLocations)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_BatchLocations_Batch");
        });

        modelBuilder.Entity<Catch>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Catches__3214EC073BE14AF7");

            entity.HasOne(d => d.Operation).WithMany(p => p.Catches)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Catches_Operation");

            entity.HasOne(d => d.Species).WithMany(p => p.Catches)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Catches_Species");
        });

        modelBuilder.Entity<EngineType>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__EngineTy__3214EC07F3BAB40A");
        });

        modelBuilder.Entity<FishBatch>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__FishBatc__3214EC07A14E5831");

            entity.HasOne(d => d.Landing).WithMany(p => p.FishBatches)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_FishBatches_Landing");

            entity.HasOne(d => d.Species).WithMany(p => p.FishBatches)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_FishBatches_Species");
        });

        modelBuilder.Entity<FishSpecy>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__FishSpec__3214EC07845DB5B2");
        });

        modelBuilder.Entity<FishingGear>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__FishingG__3214EC070D3BD345");

            entity.HasOne(d => d.GearType).WithMany(p => p.FishingGears)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_FishingGears_Type");
        });

        modelBuilder.Entity<FishingGearType>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__FishingG__3214EC072E68112E");
        });

        modelBuilder.Entity<FishingOperation>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__FishingO__3214EC075248B5A6");

            entity.HasOne(d => d.FishingGear).WithMany(p => p.FishingOperations)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_FishingOps_Gear");

            entity.HasOne(d => d.Trip).WithMany(p => p.FishingOperations)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_FishingOps_Trip");
        });

        modelBuilder.Entity<FishingPermit>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__FishingP__3214EC0761E55F54");

            entity.HasOne(d => d.Vessel).WithMany(p => p.FishingPermits)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_FishingPermits_Vessel");

            entity.HasMany(d => d.FishingGears).WithMany(p => p.Permits)
                .UsingEntity<Dictionary<string, object>>(
                    "PermitFishingGear",
                    r => r.HasOne<FishingGear>().WithMany()
                        .HasForeignKey("FishingGearId")
                        .OnDelete(DeleteBehavior.ClientSetNull)
                        .HasConstraintName("FK_PermitGears_Gear"),
                    l => l.HasOne<FishingPermit>().WithMany()
                        .HasForeignKey("PermitId")
                        .OnDelete(DeleteBehavior.ClientSetNull)
                        .HasConstraintName("FK_PermitGears_Permit"),
                    j =>
                    {
                        j.HasKey("PermitId", "FishingGearId").HasName("PK__PermitFi__7E72B374CA7502B2");
                        j.ToTable("PermitFishingGears");
                    });
        });

        modelBuilder.Entity<FishingTrip>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__FishingT__3214EC07E117A50E");

            entity.Property(e => e.DurationHours).HasComputedColumnSql("(datediff(minute,[DepartureDateTime],isnull([ArrivalDateTime],sysdatetime()))/(60.0))", false);

            entity.HasOne(d => d.Permit).WithMany(p => p.FishingTrips)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_FishingTrips_Permit");

            entity.HasOne(d => d.Vessel).WithMany(p => p.FishingTrips)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_FishingTrips_Vessel");
        });

        modelBuilder.Entity<Inspection>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Inspecti__3214EC07555A727C");

            entity.HasOne(d => d.Batch).WithMany(p => p.Inspections).HasConstraintName("FK_Inspections_Batch");

            entity.HasOne(d => d.Inspector).WithMany(p => p.Inspections)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Inspections_Inspector");

            entity.HasOne(d => d.TicketPurchase).WithMany(p => p.Inspections).HasConstraintName("FK_Inspections_Ticket");

            entity.HasOne(d => d.Vessel).WithMany(p => p.Inspections).HasConstraintName("FK_Inspections_Vessel");
        });

        modelBuilder.Entity<Inspector>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Inspecto__3214EC071830EEF4");

            entity.HasOne(d => d.Person).WithOne(p => p.Inspector)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Inspectors_Person");
        });

        modelBuilder.Entity<Landing>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Landings__3214EC07C0CFF55A");

            entity.HasOne(d => d.Trip).WithMany(p => p.Landings)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Landings_Trip");
        });

        modelBuilder.Entity<Person>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Persons__3214EC07AF20FDAD");

            entity.Property(e => e.EGN).IsFixedLength();
        });

        modelBuilder.Entity<RecreationalCatch>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Recreati__3214EC0763B75942");

            entity.HasOne(d => d.Person).WithMany(p => p.RecreationalCatches)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_RecCatches_Person");

            entity.HasOne(d => d.Species).WithMany(p => p.RecreationalCatches)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_RecCatches_Species");

            entity.HasOne(d => d.TicketPurchase).WithMany(p => p.RecreationalCatches)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_RecCatches_Ticket");
        });

        modelBuilder.Entity<TELKDecision>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__TELKDeci__3214EC07FDF32121");

            entity.HasOne(d => d.Person).WithMany(p => p.TELKDecisions)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_TELK_Person");
        });

        modelBuilder.Entity<TicketPurchase>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__TicketPu__3214EC0714114533");

            entity.Property(e => e.PurchaseDate).HasDefaultValueSql("(CONVERT([date],getdate()))");

            entity.HasOne(d => d.Person).WithMany(p => p.TicketPurchases)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_TicketPurchases_Person");

            entity.HasOne(d => d.TELKDecision).WithMany(p => p.TicketPurchases).HasConstraintName("FK_TicketPurchases_TELK");

            entity.HasOne(d => d.TicketType).WithMany(p => p.TicketPurchases)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_TicketPurchases_Type");
        });

        modelBuilder.Entity<TicketType>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__TicketTy__3214EC077D6B8F05");
        });

        modelBuilder.Entity<Vessel>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Vessels__3214EC07203BA2D7");

            entity.HasOne(d => d.Captain).WithMany(p => p.VesselCaptains)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Vessels_Captain");

            entity.HasOne(d => d.EngineType).WithMany(p => p.Vessels)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Vessels_EngineType");

            entity.HasOne(d => d.Owner).WithMany(p => p.VesselOwners)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Vessels_Owner");
        });

        modelBuilder.Entity<Violation>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Violatio__3214EC07469064E3");

            entity.HasOne(d => d.Inspection).WithMany(p => p.Violations)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Violations_Inspection");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
